import { rootReducer } from './reducers/rootReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createStore } from 'redux'

const persistConfig = {
	key: 'root',
	storage,
}

const persistReducerr = persistReducer(persistConfig, rootReducer)

let forExport = () => {
	let store = createStore(persistReducerr)
	let persistor = persistStore(store)
	return { store, persistor }
}
export default forExport
