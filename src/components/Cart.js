import React, { Component } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { connect } from 'react-redux'
import { CURRENCY_SYMBOLS as symbols } from '../components/Currency'
import '../styles/cart.css'
import ArrowLeft from '../images/Arrow-Left.svg'
import ArrowRight from '../images/Arrow-Right.svg'
import {
	changeAttribute,
	changeQuantity,
	decreaseQuantity,
	increaseQuantity,
} from '../redux/actions'
import { Link } from 'react-router-dom'

const attributesQuery = gql`
	{
		categories {
			products {
				id
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

class Cart extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imgIndexes: {},
		}
	}

	changeAttribute = (e) => {
		this.props.changeAttribute(e)
	}

	getAttributes(item) {
		let allAttributes = item.allAttributes
		if (item.quantity !== 0) {
			return (
				<div>
					{allAttributes.map((attr, ind) => {
						return (
							<div className='attr-container' key={'attr-container' + ind}>
								<p className='cart-attribute-name'>{attr.name}</p>
								<div className='cart-attr-wrapper'>
									{attr.name.toLowerCase() !== 'color'
										? attr.items.map((opt, index) => {
												return (
													<div id={item.id} key={'cart-radio-wrapper' + index}>
														<input
															type='radio'
															name={item.id + attr.name}
															id={item.id + opt.value + attr.name}
															value={opt.value}
															onClick={this.changeAttribute}
															className='cart-radio-btns'
															defaultChecked={this.checkIfChecked(
																item,
																attr.name,
																opt.value
															)}
														></input>
														<label
															className='cart-labels'
															htmlFor={item.id + opt.value + attr.name}
														>
															{opt.value}
														</label>
													</div>
												)
										  })
										: attr.items.map((opt, index) => {
												return (
													<div id={item.id} key={'cart-color-wrapper' + index}>
														<input
															type='radio'
															name={item.name + attr.name}
															id={item.id + opt.value + attr.name}
															value={opt.value}
															className='cart-color-radio-btns'
															onClick={this.changeAttribute}
															defaultChecked={this.checkIfChecked(
																item,
																attr.name,
																opt.value
															)}
														></input>
														<label
															style={{ backgroundColor: opt.value }}
															className='cart-color-labels'
															htmlFor={item.id + opt.value + attr.name}
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

	fillIndexes = () => {
		let products = this.props.productsInCart
		let ind = {}
		for (let i = 0; i < products.length; i++) {
			ind[products[i].id] = 0
		}
		this.setState({
			imgIndexes: ind,
		})
	}

	componentDidMount() {
		this.fillIndexes()
	}

	changeImg = (e) => {
		let clsName = e.target.className
		let galleryLength = this.props.productsInCart.find(
			(item) => item.id === e.target.id
		).gallery.length
		if (clsName === 'change-img-btn right') {
			if (this.state.imgIndexes[e.target.id] < galleryLength - 1) {
				this.setState({
					imgIndexes: {
						...this.state.imgIndexes,
						[e.target.id]: this.state.imgIndexes[e.target.id] + 1,
					},
				})
			} else {
				this.setState({
					imgIndexes: {
						...this.state.imgIndexes,
						[e.target.id]: 0,
					},
				})
			}
		}
		if (clsName === 'change-img-btn left') {
			if (this.state.imgIndexes[e.target.id] > 0) {
				this.setState({
					imgIndexes: {
						...this.state.imgIndexes,
						[e.target.id]: this.state.imgIndexes[e.target.id] - 1,
					},
				})
			}
			if (this.state.imgIndexes[e.target.id] === 0) {
				this.setState({
					imgIndexes: {
						...this.state.imgIndexes,
						[e.target.id]: galleryLength - 1,
					},
				})
			}
		}
	}

	getImages(item) {
		return (
			<div style={{ position: 'relative' }}>
				<img
					onClick={this.changeImg}
					className='change-img-btn left'
					id={item.id}
					src={ArrowLeft}
					alt='left arrow'
				/>
				<div>
					<img
						src={item.gallery[this.state.imgIndexes[item.id]]}
						alt='product'
						className='cart-prod-imgs'
						width='140px'
						height='180px'
					/>
				</div>
				<img
					onClick={this.changeImg}
					className='change-img-btn right'
					id={item.id}
					src={ArrowRight}
					alt='arrow right'
				/>
			</div>
		)
	}

	getPrice(item) {
		let [price] = item.price.filter(
			(item) => item.currency === this.props.currency
		)
		return `${symbols[price.currency]}${price.amount}`
	}

	increseQuantity = (e) => {
		this.props.increaseQuantity(e)
	}

	decreaseQuantity = (e) => {
		this.props.decreaseQuantity(e)
	}

	render() {
		return (
			<div className='cart-wrapper'>
				<p>Cart</p>
				<div>
					{this.props.productsInCart.map((item, index) => {
						return (
							<div className='cart-prod-wrapper' key={'cart-wrapp' + index}>
								<div>
									<h2 className='cart-item-brand'>{item.brand}</h2>
									<Link to={`/products/${item.defaultId}`}>
										<h3 className='cart-item-name'>{item.itemName}</h3>
									</Link>
									<h3 className='cart-item-price'>{this.getPrice(item)}</h3>
									<div className='cart-attributes'>
										{this.getAttributes(item)}
									</div>
								</div>
								<div className='prod-quan-wrapper'>
									<div className='quantity-wrapper'>
										<div
											id={item.id}
											onClick={this.increseQuantity}
											className='change-quantity increase'
										>
											+
										</div>
										<p>{item.quantity}</p>
										<div
											id={item.id}
											onClick={this.decreaseQuantity}
											className='change-quantity decrease'
										>
											-
										</div>
									</div>
									<div className='cart-images'>{this.getImages(item)}</div>
								</div>
							</div>
						)
					})}
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
		changeQuantity: (act) => dispatch(changeQuantity(act)),
		increaseQuantity: (item) => dispatch(increaseQuantity(item)),
		decreaseQuantity: (item) => dispatch(decreaseQuantity(item)),
		changeAttribute: (item) => dispatch(changeAttribute(item)),
	}
}

export default graphql(attributesQuery)(
	connect(mapStateToProps, mapDispatchToProps)(Cart)
)
