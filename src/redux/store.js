import { rootReducer } from './reducers/rootReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createStore } from 'redux'

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['addToCart'],
}

const persistReducerr = persistReducer(persistConfig, rootReducer)

let forExport = () => {
	let store = createStore(
		persistReducerr,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
	let persistor = persistStore(store)
	return { store, persistor }
}
export default forExport
