import React, { Component } from 'react'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { connect } from 'react-redux'
import { changeCurrency, openCurrency } from '../redux/actions'

const CURRENCIES = gql`
	{
		currencies
	}
`
export const CURRENCY_SYMBOLS = {
	USD: '$',
	GBP: '£',
	AUD: 'A$',
	JPY: '¥',
	RUB: '₽',
}

class Currency extends Component {
	handleCurrencyChange = (e) => {
		let id = e.target.id
		this.props.changeCurrency(id)
		this.props.closeCurrency()
	}

	getCurrencies() {
		const data = this.props.data
		if (data.loading) {
			return
		} else {
			return data.currencies.map((currency, index) => {
				return (
					<li
						key={'currency' + index}
						id={currency}
						onClick={this.handleCurrencyChange}
						className='currency-li'
					>
						{CURRENCY_SYMBOLS[currency]} {currency}
					</li>
				)
			})
		}
	}
	render() {
		return <div className='currencies-wrapper'>{this.getCurrencies()}</div>
	}
}

const mapStateToProps = (state) => {
	return {
		currency: state.changeCurrency.currency,
		currencyIsOpen: state.currencyOpen.currencyIsOpen,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		changeCurrency: (currency) => dispatch(changeCurrency(currency)),
		closeCurrency: () => dispatch(openCurrency()),
	}
}

export default graphql(CURRENCIES)(
	connect(mapStateToProps, mapDispatchToProps)(Currency)
)
