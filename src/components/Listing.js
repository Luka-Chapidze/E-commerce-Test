import React, { Component } from 'react'
import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import { connect } from 'react-redux'
import { addToCart, changeQuantity, openCurrency } from '../redux/actions'
import '../styles/listing.css'
import addToCartImg from '../images/Add-To-Cart.svg'
import { CURRENCY_SYMBOLS as symbols } from '../components/Currency'
import { Link } from 'react-router-dom'

const PRODUCTS = gql`
	query getCat($cat: CategoryInput!) {
		category(input: $cat) {
			name
			products {
				id
				brand
				name
				inStock
				gallery
				prices {
					amount
					currency
				}
				attributes {
					name
					id
					items {
						value
						displayValue
						id
					}
				}
			}
		}
	}
`

class Listing extends Component {
	addAttributesToCart(attributes) {
		let item = {}
		attributes.forEach((attr) => {
			if (attr.name !== 'Color') {
				item[attr.id] = attr.items[0].id
			} else if (attr.name === 'Color') {
				item[attr.id] = attr.items[0].value
			}
		})
		return item
	}

	addToCart = (e) => {
		let data = this.props.data
		if (data.loading) {
			return ''
		} else {
			let item = data.category.products.find((prod) => {
				return prod.id === e.target.id
			})

			let attrObj = this.addAttributesToCart(item.attributes)

			let product = {
				defaultId: item.id,
				id: `${Object.values(attrObj).join('-')}-${item.id}`.replaceAll(
					',',
					'-'
				),
				name: item.id,
				gallery: item.gallery,
				quantity: 1,
				brand: item.brand,
				price: item.prices,
				allAttributes: item.attributes,
				attributes: attrObj,
				itemName: item.name,
			}

			let itemInCart = this.props.productsInCart.find((prod) => {
				return prod.id === product.id
			})

			if (itemInCart === undefined) {
				this.props.addToCart(product)
			} else {
				this.props.changeQuantity(product)
			}
		}
	}

	returnItems(prod) {
		return (
			<div
				key={prod.id}
				id={prod.id}
				className={prod.inStock ? 'product-wrapper' : 'no-stock-wrapper'}
			>
				{prod.inStock ? (
					<Link to={`/products/${prod.id}`}>
						<div className='listing-product-img-wrapper'>
							<img
								src={prod.gallery[0]}
								alt='product'
								className='product-img'
							/>
						</div>
					</Link>
				) : (
					<Link to={`/products/${prod.id}`}>
						<div className='listing-product-img-wrapper'>
							<img
								src={prod.gallery[0]}
								alt='product'
								className='product-img out-of-stock'
							/>
						</div>
					</Link>
				)}
				<p className='product-name'>
					{prod.brand} {prod.name}
				</p>
				<span className='product-price'>{this.getPrice(prod)}</span>
				<button onClick={this.addToCart} className='add-btn'>
					<img id={prod.id} src={addToCartImg} alt='cart icon' />
				</button>
			</div>
		)
	}

	getProducts() {
		let { data } = this.props
		if (data.loading) {
			return ''
		} else {
			return data.category.products.map((prod) => {
				return this.returnItems(prod)
			})
		}
	}

	getPrice = (prod) => {
		let amount = prod.prices.filter(
			(item) => item.currency === this.props.currency
		)
		return (
			<p>
				{symbols[this.props.currency]}
				{amount[0].amount}
			</p>
		)
	}

	render() {
		let category = this.props.match.params.category
		return (
			<div
				className='listing-page'
				onClick={
					this.props.currencyIsOpen ? this.props.closeCurrency : () => {}
				}
			>
				<h1 className='category-name'>{category}</h1>
				<div className='listings-wrapper'>{this.getProducts(category)}</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.changeCategory.category,
		currency: state.changeCurrency.currency,
		productsInCart: state.addToCart.productsInCart,
		currencyIsOpen: state.currencyOpen.currencyIsOpen,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (product) => dispatch(addToCart(product)),
		changeQuantity: (product) => dispatch(changeQuantity(product)),
		closeCurrency: () => dispatch(openCurrency()),
	}
}
export default graphql(PRODUCTS, {
	options: (props) => ({
		variables: { cat: { title: props.match.params.category || '' } },
	}),
})(connect(mapStateToProps, mapDispatchToProps)(Listing))
