import React, { Component } from 'react'
import { connect } from 'react-redux'
import { gql } from '@apollo/client'
import { graphql } from '@apollo/client/react/hoc'
import '../styles/cartPreview.css'
import { Link } from 'react-router-dom'
import { openCart, increaseQuantity, decreaseQuantity } from '../redux/actions'
import { CURRENCY_SYMBOLS as symbols } from './Currency'

const prodQuery = gql`
	{
		categories {
			name
		}
	}
`

class CartPreview extends Component {
	getData() {
		const data = this.props.data
		if (data.loading) {
			return ''
		} else {
		}
	}

	closeCart = (e) => {
		return e.target.className === 'review-cart-container'
			? this.props.openCart()
			: ''
	}

	getPrice(item) {
		let [price] = item.price.filter(
			(item) => item.currency === this.props.currency
		)
		return `${symbols[price.currency]}${price.amount}`
	}

	getItems = () => {
		let products = this.props.productsInCart
		return products.map((item, index) => {
			return (
				<div
					className='cart-prev-item-container'
					key={'cart-prev-item-container' + index}
				>
					<div className='cart-preview-item' key={'cart-preview-item' + index}>
						<h2>{item.brand}</h2>
						<h3>{item.itemName}</h3>
						<p>{this.getPrice(item)}</p>
						<div>{this.getAttributes(item)}</div>
					</div>
					<div className='cart-prev-img-wrapper'>
						<div className='prod-quan-wrapper'>
							<div className='quantity-wrapper'>
								<div
									id={item.id}
									onClick={this.increseQuantity}
									className='cart-prev-change-quantity increase'
								>
									+
								</div>
								<p>{item.quantity}</p>
								<div
									id={item.id}
									onClick={this.decreaseQuantity}
									className='cart-prev-change-quantity decrease'
								>
									-
								</div>
							</div>
						</div>
						<Link
							onClick={this.props.openCart}
							to={`/products/${item.defaultId}`}
						>
							<img src={item.gallery[0]} width='105px' alt='product' />
						</Link>
					</div>
				</div>
			)
		})
	}

	getTotalPrice() {
		let priceSum = 0
		let products = this.props.productsInCart

		for (let i = 0; i < products.length; i++) {
			let prodPrice = products[i].price.find(
				(prod) => prod.currency === this.props.currency
			).amount
			let quant = products[i].quantity
			priceSum += Math.floor(quant * prodPrice)
		}

		return `${symbols[this.props.currency]}${priceSum}`
	}

	getAttributes(item) {
		let allAttributes = item.allAttributes
		if (item.quantity !== 0) {
			return (
				<div>
					{allAttributes.map((attr, index) => {
						return (
							<div
								className='cart-prev-attr-container'
								key={'cart-prev-attr' + index}
							>
								<p className='cart-prev-attribute-name'>{attr.name}</p>
								<div className='cart-prev-attr-wrapper'>
									{attr.name.toLowerCase() !== 'color'
										? attr.items.map((opt, index) => {
												return (
													<div id={item.id} key={'cart-prev-radio' + index}>
														<input
															type='radio'
															name={item.id + attr.name + 'prev'}
															id={item.id + opt.value + attr.name + 'prev'}
															value={opt.value}
															className='cart-prev-radio-btns'
															defaultChecked={this.checkIfChecked(
																item,
																attr.name,
																opt.value
															)}
															disabled
														></input>
														<label
															className='cart-prev-labels'
															htmlFor={item.id + opt.value + attr.name + 'prev'}
														>
															{opt.value}
														</label>
													</div>
												)
										  })
										: attr.items.map((opt, index) => {
												return (
													<div
														id={item.id}
														key={'cart-prev-color-radio' + index}
													>
														<input
															type='radio'
															name={item.name + attr.name + 'prev'}
															id={item.id + opt.value + attr.name + 'prev'}
															value={opt.value}
															className='cart-prev-color-radio-btns'
															defaultChecked={this.checkIfChecked(
																item,
																attr.name,
																opt.value
															)}
															disabled
														></input>
														<label
															style={{ backgroundColor: opt.value }}
															className='cart-prev-color-labels'
															htmlFor={item.id + opt.value + attr.name + 'prev'}
														></label>
													</div>
												)
										  })}
								</div>
							</div>
						)
					})}
				</div>
			)
		}
	}

	checkIfChecked = (item, name, value) => {
		let prod = this.props.productsInCart.find((it) => {
			return it.id === item.id
		})
		let attr = prod.attributes

		if (attr[name] === value) {
			return true
		}
	}

	getFullQuantity() {
		let quanList = this.props.productsInCart.map((prod) => {
			return prod.quantity
		})
		return quanList.reduce((a, b) => a + b, 0)
	}

	increseQuantity = (e) => {
		this.props.increaseQuantity(e)
	}

	decreaseQuantity = (e) => {
		this.props.decreaseQuantity(e)
	}

	render() {
		return (
			<div
				style={{
					height: `${document.documentElement.offsetHeight}px`,
				}}
				onClick={this.closeCart}
				className='review-cart-container'
			>
				<div className='review-cart-wrapper'>
					<span className='bolder-cart-prev-text'>
						<p>My Bag, </p>
						{`${this.getFullQuantity()} Items`}
					</span>
					{this.getItems()}
					<div className='cart-prev-total'>
						<p className=''>Total</p>
						{this.getTotalPrice()}
					</div>
					<div className='cart-prev-buttons-wrapper'>
						<Link
							className='cart-prev-gotocart'
							to='/cart'
							onClick={this.props.openCart}
						>
							View Bag
						</Link>
						<Link
							className='cart-prev-checkout'
							to='/cart'
							onClick={this.props.openCart}
						>
							CHECK OUT
						</Link>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		productsInCart: state.addToCart.productsInCart,
		currency: state.changeCurrency.currency,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		openCart: () => dispatch(openCart()),
		increaseQuantity: (item) => dispatch(increaseQuantity(item)),
		decreaseQuantity: (item) => dispatch(decreaseQuantity(item)),
	}
}
export default graphql(prodQuery)(
	connect(mapStateToProps, mapDispatchToProps)(CartPreview)
)
