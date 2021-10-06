import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/reset.css'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import getReducer from './redux/store'

const { store, persistor } = getReducer()

const client = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache(),
})

ReactDOM.render(
	<ApolloProvider client={client}>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</Provider>
	</ApolloProvider>,
	document.getElementById('root')
)
