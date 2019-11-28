import { createStore } from 'redux';
import rootReducer from '../src/reducers';

const store = createStore(rootReducer);

export default store;
