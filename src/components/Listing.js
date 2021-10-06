import React, { Component } from 'react'
import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import { connect } from 'react-redux'
import { changeCategory, addToCart, changeQuantity } from '../redux/actions'
import '../styles/listing.css'
import addToCartImg from '../images/Add-To-Cart.svg'
import { CURRENCY_SYMBOLS as symbols } from '../components/Currency'
import CartPreview from '../components/CartPreview'
import { Link } from 'react-router-dom'

const PRODUCTS = gql`
	{
		categories {
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
		attributes.map((attr) => {
			console.log(attr.name)
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
			let [[item]] = data.categories
				.map((category) => {
					return category.products.filter((prod) => {
						return prod.id === e.target.id
					})
				})
				.filter((item) => item.length !== 0)

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

			if (itemInCart == undefined) {
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
						<img
							src={prod.gallery[0]}
							width='354px'
							height='330px'
							alt='product image'
							className='product-img'
						/>
					</Link>
				) : (
					<img
						src={prod.gallery[0]}
						width='354px'
						height='330px'
						alt='product image'
						className='product-img out-of-stock'
					/>
				)}
				<p className='product-name'>
					{prod.brand} {prod.name}
				</p>
				<p className='product-price'>{this.getPrice(prod)}</p>
				<button onClick={this.addToCart} className='add-btn'>
					<img id={prod.id} src={addToCartImg} alt='' />
				</button>
			</div>
		)
	}

	getAllProducts() {
		let data = this.props.data
		if (data.loading) {
			return ''
		} else {
			return data.categories.map((category) => {
				return category.products.map((prod) => {
					return this.returnItems(prod)
				})
			})
		}
	}

	getProducts(category) {
		let data = this.props.data
		if (data.loading) {
			return ''
		} else {
			let filteredProd = data.categories.filter(
				(item) => item.name === category
			)
			return filteredProd[0].products.map((prod) => {
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
			<div className='listing-page'>
				<h1 className='category-name'>{category}</h1>
				<div className='listings-wrapper'>
					{category == undefined
						? this.getAllProducts()
						: this.getProducts(category)}
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.changeCategory.category,
		currency: state.changeCurrency.currency,
		productsInCart: state.addToCart.productsInCart,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addToCart: (product) => dispatch(addToCart(product)),
		changeQuantity: (product) => dispatch(changeQuantity(product)),
	}
}

export default graphql(PRODUCTS)(
	connect(mapStateToProps, mapDispatchToProps)(Listing)
)
