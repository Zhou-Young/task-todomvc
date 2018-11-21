import * as todoapi from '../api/todo';
import { GET_TODO_LIST } from '../constants/todo';

// action相当于一个对象

// 获取todolist列表
export const getTodoList = (filter = 'ALL') => async dispatch => {
  await dispatch({
    type: GET_TODO_LIST,
    data: todoapi.getTodoList(filter)
  });
};

// 增加todolist
export const addTodo = text => async () => {
  todoapi.addTodo(text);
};

// 删除
export const deleteTodo = (id, callback) => async () => {
  todoapi.deleteTodo(id).then(() => {
    callback && callback();
  });
};

// 修改
export const modifyTodo = data => async () => {
  todoapi.modifyTodo(data.id, data.text);
};

// 勾选已完成
export const toggleTodo = id => async () => {
  todoapi.toggleTodo(id);
};

// 清空
export const clearCompleted = () => async () => {
  todoapi.clearCompleted();
};

// 全选
export const chooseAll = () => async () => {
  todoapi.chooseAll();
};
