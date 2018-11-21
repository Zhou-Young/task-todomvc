export const getTodoList = (filter = 'ALL') => {
  if (localStorage.getItem('todoList') === null) {
    localStorage.setItem('todoList', JSON.stringify([]));
    localStorage.setItem('nextTodoId', JSON.stringify(0));
  }
  const todoList = JSON.parse(localStorage.getItem('todoList'));
  if (filter === 'Active') {
    return todoList.filter(t => !t.completed);
  }
  if (filter === 'Completed') {
    return todoList.filter(t => t.completed);
  }
  return todoList;
};

export const addTodo = data => {
  const preTodoId = JSON.parse(localStorage.getItem('nextTodoId'));
  const nextTodoId = preTodoId + 1;
  localStorage.nextTodoId = JSON.stringify(nextTodoId);
  const list = {
    id: preTodoId,
    text: data,
    completed: false
  };
  if (localStorage.getItem('todoList') === null) {
    localStorage.setItem('todoList', JSON.stringify([]));
  }
  const todoList = JSON.parse(localStorage.getItem('todoList'));
  todoList.push(list);
  localStorage.todoList = JSON.stringify(todoList);
};

export const toggleTodo = id => {
  let todoList = JSON.parse(localStorage.getItem('todoList'));
  todoList = todoList.map(
    todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)
  );
  localStorage.todoList = JSON.stringify(todoList);
};

export const deleteTodo = async id => {
  let todoList = JSON.parse(localStorage.getItem('todoList'));
  todoList = todoList.filter(t => t.id !== id);
  localStorage.todoList = JSON.stringify(todoList);
};

export const modifyTodo = (id, text) => {
  let todoList = JSON.parse(localStorage.getItem('todoList'));
  todoList = todoList.map(todo => (todo.id === id ? { ...todo, text } : todo));
  localStorage.todoList = JSON.stringify(todoList);
};

export const clearCompleted = () => {
  let todoList = JSON.parse(localStorage.getItem('todoList'));
  todoList = todoList.filter(t => !t.completed);
  localStorage.todoList = JSON.stringify(todoList);
};
export const chooseAll = () => {
  let todoList = JSON.parse(localStorage.getItem('todoList'));
  if (todoList.length === todoList.filter(t => t.completed).length) {
    todoList = todoList.map(todo => ({ ...todo, completed: false }));
  } else {
    todoList = todoList.map(todo => ({ ...todo, completed: true }));
  }
  localStorage.todoList = JSON.stringify(todoList);
};
