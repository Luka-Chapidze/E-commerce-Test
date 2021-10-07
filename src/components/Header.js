import React, { Component } from 'react'
import { connect } from 'react-redux'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { NavLink, Link } from 'react-router-dom'
import Currency from '../components/Currency'
import { CURRENCY_SYMBOLS } from '../components/Currency'
import '../styles/header.css'
import Arrow_Down from '../images/Arrow-Down.svg'
import Arrow_Up from '../images/Arrow-Up.svg'
import Cart from '../images/Cart.svg'
import Logo from '../images/Logo.svg'
import { changeCategory, openCurrency, openCart } from '../redux/actions'
import CartPreview from './CartPreview'

const CATEGORIES = gql`
	{
		categories {
			name
		}
	}
`

class Header extends Component {
	handleCatChange = (e) => {
		let id = e.target.id
		this.props.changeCategory(id)
		this.handleCartOpen()
	}

	getCategories() {
		const data = this.props.data
		if (data.loading) {
			return ''
		} else {
			return data.categories.map((item, index) => {
				return (
					<NavLink
						key={'category-navlink' + index}
						to={`/${item.name}`}
						id={item.name}
						className='category-btn'
						activeClassName='selected'
						onClick={this.handleCatChange}
					>
						{item.name}
					</NavLink>
				)
			})
		}
	}

	getFullQuantity() {
		let quanList = this.props.productsInCart.map((prod) => {
			return prod.quantity
		})
		let sum = quanList.reduce((a, b) => a + b, 0)
		return sum
	}

	handleCartOpen = () => {
		if (this.props.cartIsOpen) {
			this.props.openCart()
		}
	}

	handeCurrencyOpen = () => {
		this.props.openCurrency()
		if (this.props.cartIsOpen) {
			this.props.openCart()
		}
	}

	render() {
		return (
			<div id='header-wrapper'>
				<nav>
					<div className='category-wrapper'>{this.getCategories()}</div>
					<div className='logo'>
						<Link to='/' onClick={this.handleCartOpen}>
							<img src={Logo} alt='Logo' />
						</Link>
					</div>
					<div className='currency'>
						<p>{CURRENCY_SYMBOLS[this.props.currency]}</p>
						<button onClick={this.handeCurrencyOpen}>
							<img
								src={this.props.currencyIsOpen ? Arrow_Up : Arrow_Down}
								alt='arrow to open currency options'
							/>
						</button>
						{this.props.currencyIsOpen ? <Currency /> : ''}
						<div>
							<button onClick={this.props.openCart} className='cart-btn'>
								<img src={Cart} alt='cart icon' />
								<div className='prod-quantity'>
									<p>{this.getFullQuantity()}</p>
								</div>
							</button>
						</div>
					</div>
				</nav>
				<div>{this.props.cartIsOpen ? <CartPreview /> : ''}</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		currencyIsOpen: state.currencyOpen.currencyIsOpen,
		currency: state.changeCurrency.currency,
		category: state.changeCategory.category,
		productsInCart: state.addToCart.productsInCart,
		cartIsOpen: state.openCart.cartIsOpen,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		openCurrency: () => dispatch(openCurrency()),
		changeCategory: (category) => dispatch(changeCategory(category)),
		openCart: () => dispatch(openCart()),
	}
}

export default graphql(CATEGORIES)(
	connect(mapStateToProps, mapDispatchToProps)(Header)
)
