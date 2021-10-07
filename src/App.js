import { connect } from 'react-redux'
import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Listing from './components/Listing'
import Details from './components/Details'
import Cart from './components/Cart'
export class App extends Component {
	render() {
		return (
			<div>
				<BrowserRouter>
					<Header />
					<Switch>
						<Route exact path='/' component={Listing} />
						<Route exact path='/cart' component={Cart} />
						<Route exact path='/:category' component={Listing} />
						<Route path='/products/:id' component={Details} />
					</Switch>
				</BrowserRouter>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		category: state.changeCategory.category,
	}
}

export default connect(mapStateToProps)(App)
