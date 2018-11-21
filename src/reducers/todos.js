import { createReducer } from 'redux-immutablejs';
import { fromJS } from 'immutable';
import { GET_TODO_LIST } from '../constants/todo';
// import { addTodo } from '../actions/todoAction';

const initialState = fromJS({
  todoList: []
});

const todos = {
  [GET_TODO_LIST]: (state, { data }) => state.merge({ todoList: data })
};

export default createReducer(initialState, todos);
