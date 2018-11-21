import { createReducer } from 'redux-immutablejs';
import { fromJS } from 'immutable';
import { SET_VISIBILITY_FILTER, FILTER_TODO } from '../constants/todo';

const initialState = fromJS({
  filter: 'ALL',
  filterList: []
});

const filter = {
  [SET_VISIBILITY_FILTER]: (state, action) => state.merge({ filter: action.filter }),
  [FILTER_TODO]: (state, action) => state.merge({ filterList: action.filter })
};

export default createReducer(initialState, filter);
