import { combineReducers } from 'redux'
import {
	OPEN_CART,
	OPEN_CURRENCY,
	CHANGE_CURRENCY,
	CHANGE_CATEGORY,
	ADD_TO_CART,
	CHANGE_QUANTITY,
	INCREASE_QUANTITY,
	DECREASE_QUANTITY,
	CHANGE_ATTRIBUTE,
} from '../types'

const initialState = {
	category: '',
	currencyIsOpen: false,
	currency: 'USD',
	cartIsOpen: false,
	productsInCart: [],
	selectedImg: '',
}

const currencyReducer = (state = initialState, action) => {
	switch (action.type) {
		case OPEN_CURRENCY:
			return {
				...state,
				currencyIsOpen: !state.currencyIsOpen,
			}

		default:
			return state
	}
}

const changeCurrencyReducer = (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_CURRENCY:
			return {
				...state,
				currency: action.currency,
				currencyIsOpen: false,
			}
		default:
			return state
	}
}

const changeCategoryReducer = (state = initialState, action) => {
	switch (action.type) {
		case CHANGE_CATEGORY:
			return {
				...state,
				category: action.payload,
			}
		default:
			return state
	}
}

const addToCartReducer = (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			return {
				...state,
				productsInCart: [...state.productsInCart, action.payload],
			}

		case CHANGE_QUANTITY:
			let item = state.productsInCart.find(
				(item) => item.id === action.payload.id
			)

			return {
				...state,
				productsInCart: [
					...state.productsInCart.slice(0, state.productsInCart.indexOf(item)),
					{ ...item, quantity: item.quantity + 1 },
					...state.productsInCart.slice(state.productsInCart.indexOf(item) + 1),
				],
			}

		case INCREASE_QUANTITY:
			let item1 = state.productsInCart.find(
				(item) => item.id === action.payload.target.id
			)

			return {
				...state,
				productsInCart: [
					...state.productsInCart.slice(0, state.productsInCart.indexOf(item1)),
					{ ...item1, quantity: item1.quantity + 1 },
					...state.productsInCart.slice(
						state.productsInCart.indexOf(item1) + 1
					),
				],
			}

		case DECREASE_QUANTITY:
			let item2 = state.productsInCart.find(
				(item) => item.id === action.payload.target.id
			)

			if (item2.quantity > 0) {
				if (item2.quantity === 1) {
					return {
						...state,
						productsInCart: [
							...state.productsInCart.slice(
								0,
								state.productsInCart.indexOf(item2)
							),
							...state.productsInCart.slice(
								state.productsInCart.indexOf(item2) + 1
							),
						],
					}
				} else {
					return {
						...state,
						productsInCart: [
							...state.productsInCart.slice(
								0,
								state.productsInCart.indexOf(item2)
							),
							{ ...item2, quantity: item2.quantity - 1 },
							...state.productsInCart.slice(
								state.productsInCart.indexOf(item2) + 1
							),
						],
					}
				}
			}
			break
		case CHANGE_ATTRIBUTE:
			let id = action.payload.target.parentElement.id
			let itemToChange = state.productsInCart.find((item) => item.id === id)
			let attributes = itemToChange.attributes
			if (itemToChange.quantity > 0) {
				return {
					...state,
					productsInCart: [
						...state.productsInCart.slice(
							0,
							state.productsInCart.indexOf(itemToChange)
						),
						{
							...itemToChange,
							attributes: {
								...attributes,
								[Object.keys(attributes)[0]]: action.payload.target.value,
							},
						},
						...state.productsInCart.slice(
							state.productsInCart.indexOf(itemToChange) + 1
						),
					],
				}
			}
			break
		default:
			return state
	}
}

const openCartReducer = (state = initialState, action) => {
	switch (action.type) {
		case OPEN_CART:
			return {
				...state,
				cartIsOpen: !state.cartIsOpen,
			}
		default:
			return state
	}
}

export const rootReducer = combineReducers({
	currencyOpen: currencyReducer,
	changeCurrency: changeCurrencyReducer,
	changeCategory: changeCategoryReducer,
	addToCart: addToCartReducer,
	openCart: openCartReducer,
})

export default rootReducer
