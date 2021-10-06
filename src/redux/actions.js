import {
	CHANGE_CURRENCY,
	OPEN_CART,
	ADD_TO_CART,
	CHANGE_CATEGORY,
	OPEN_CURRENCY,
	CHANGE_QUANTITY,
	INCREASE_QUANTITY,
	DECREASE_QUANTITY,
	CHANGE_ATTRIBUTE,
} from './types'

export const openCart = () => {
	return {
		type: OPEN_CART,
	}
}

export const changeCurrency = (currency) => {
	return {
		type: CHANGE_CURRENCY,
		currency,
	}
}

export const addToCart = (product) => {
	return {
		type: ADD_TO_CART,
		payload: product,
	}
}

export const changeCategory = (category) => {
	return {
		type: CHANGE_CATEGORY,
		payload: category,
	}
}

export const openCurrency = () => {
	return {
		type: OPEN_CURRENCY,
	}
}

export const changeQuantity = (id) => {
	return {
		type: CHANGE_QUANTITY,
		payload: id,
	}
}

export const increaseQuantity = (id) => {
	return {
		type: INCREASE_QUANTITY,
		payload: id,
	}
}

export const decreaseQuantity = (id) => {
	return {
		type: DECREASE_QUANTITY,
		payload: id,
	}
}

export const changeAttribute = (payload) => {
	return {
		type: CHANGE_ATTRIBUTE,
		payload,
	}
}
