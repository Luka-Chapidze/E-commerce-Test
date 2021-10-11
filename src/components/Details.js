import React, { Component } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import '../styles/details.css'
import { connect } from 'react-redux'
import { CURRENCY_SYMBOLS as symbols } from '../components/Currency'
import { addToCart, changeQuantity } from '../redux/actions'
import ReactHtmlParser from 'react-html-parser'

const prodInfo = gql`
	{
		categories {
			products {
				id
				brand
				prices {
					amount
					currency
				}
				inStock
				description
				name
				gallery
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

class Details extends Component {
	constructor(props) {
		super(props)
		this.state = {
			imageUrl: '',
			attributes: {},
		}
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

			let product = {
				defaultId: item.id,
				id: `${Object.values(this.state.attributes).join('-')}-${item.id}`,
				gallery: item.gallery,
				quantity: 1,
				name: item.name,
				brand: item.brand,
				price: item.prices,
				allAttributes: item.attributes,
				attributes: this.state.attributes,
				itemName: item.name,
			}

			let itemInCart = this.props.productsInCart.find((prod) => {
				return prod.id === product.id
			})

			if (itemInCart === undefined) {
				if (
					Object.keys(product.attributes).length !==
					product.allAttributes.length
				) {
					document.documentElement.style.setProperty(
						'--display-for-before',
						'inline'
					)
				} else {
					this.props.addToCart(product)
					document.documentElement.style.setProperty(
						'--display-for-before',
						'none'
					)
				}
			} else {
				this.props.changeQuantity(product)
				document.documentElement.style.setProperty(
					'--display-for-before',
					'none'
				)
			}
		}
	}

	getImages = (arr) => {
		return arr.map((src, ind) => {
			return (
				<div
					className='details-imgs-wrapper'
					key={'details-imgs-wrapper' + ind}
				>
					<img
						src={src}
						alt='product'
						onClick={this.getImgSrc}
						key={'details-img' + ind}
					/>
				</div>
			)
		})
	}

	addAttributesToCart = (e) => {
		this.setState({
			attributes: { ...this.state.attributes, [e.target.name]: e.target.value },
		})
		document.documentElement.style.setProperty('--display-for-before', 'none')
	}

	getImgSrc = (e) => {
		this.setState({
			imageUrl: e.target.src,
		})
	}

	getAttributes(product) {
		let attributes = product.attributes
		return attributes.map((item, index) => (
			<form className='form' action='' key={item.id + index}>
				<p>{item.name}:</p>
				<div className='radios-wrapper'>
					{item.name.toLowerCase() !== 'color'
						? item.items.map((opt, index) => (
								<div key={'radio-wrapper' + index}>
									<input
										type='radio'
										name={item.name}
										id={item.id + opt.value}
										value={opt.value}
										className='radio-btns'
										onClick={this.addAttributesToCart}
									></input>
									<label className='labels' htmlFor={item.id + opt.value}>
										{opt.value}
									</label>
								</div>
						  ))
						: item.items.map((opt, index) => (
								<div key={'color-radio-wrapper' + index}>
									<input
										type='radio'
										name={item.name}
										id={item.id + opt.value}
										value={opt.value}
										className='color-radio-btns'
										onClick={this.addAttributesToCart}
									></input>
									<label
										style={{ backgroundColor: opt.value }}
										className='color-labels'
										htmlFor={item.id + opt.value}
									></label>
								</div>
						  ))}
				</div>
			</form>
		))
	}

	getPrice(item) {
		return (
			<div className='pdp-price-wrapper'>
				<p className='pdp-price-text'>Price:</p>
				<p className='pdp-price'>
					{symbols[this.props.currency]}
					{
						item.prices.filter(
							(item) => item.currency === this.props.currency
						)[0].amount
					}
				</p>
			</div>
		)
	}

	componentDidMount() {
		window.scrollTo(0, 0)
	}

	getData = () => {
		const data = this.props.data
		if (data.loading) {
			return ''
		} else {
			let [[item]] = data.categories
				.map((category) => {
					return category.products.filter((item) => {
						return item.id === this.props.match.params.id
					})
				})
				.filter((item) => item.length !== 0)

			return (
				<div className='images-wrapper'>
					<div className='images-cont'>
						<div className='pdp-images'>{this.getImages(item.gallery)}</div>
						<div className='active-img-wrapper'>
							<img
								className='active-img'
								src={
									this.state.imageUrl === ''
										? item.gallery[0]
										: this.state.imageUrl
								}
								alt='product'
							/>
						</div>
					</div>
					<div className='info-wrapper'>
						<div className='details-texts'>
							<h2>{item.brand}</h2>
							<h3>{item.name}</h3>
						</div>
						<div className='attributes-wrapper'>{this.getAttributes(item)}</div>
						<div>{this.getPrice(item)}</div>
						<div>
							{item.inStock ? (
								<button
									id={item.id}
									className='pdp-add-btn'
									onClick={this.addToCart}
								>
									Add To Cart
								</button>
							) : (
								<button id={item.id} className='out-of-stock-btn'>
									Out Of Stock
								</button>
							)}
						</div>
						<div className='description'>
							{ReactHtmlParser(item.description)}
						</div>
					</div>
				</div>
			)
		}
	}
	render() {
		return <div className='details-wrapper'>{this.getData()}</div>
	}
}

const mapStateToProps = (state) => {
	return {
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

export default graphql(prodInfo)(
	connect(mapStateToProps, mapDispatchToProps)(Details)
)
