import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { is, fromJS } from 'immutable';
import TodoItem from '../components/TodoItem';
import * as todoActions from '../actions/todoAction';
import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'ALL'
    };
    this.input = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
  }

  onKeyup(e) {
    e.keyCode === 13 && this.addTodo();
  }

  fetchData() {
    const {
      todoActions: { getTodoList }
    } = this.props;
    getTodoList && getTodoList();
    console.log('featch');
  }

  addTodo() {
    const {
      todoActions: { addTodo }
    } = this.props;
    !!this.input.current.value &&
      addTodo &&
      addTodo(this.input.current.value).then(() => {
        this.fetchData();
      });

    this.input.current.value = '';
  }

  checkToggle(i) {
    const {
      todoActions: { toggleTodo }
    } = this.props;
    toggleTodo &&
      toggleTodo(i).then(() => {
        this.fetchData();
      });
  }

  checkFilter(e) {
    const {
      todoActions: { getTodoList }
    } = this.props;
    getTodoList && getTodoList(e);
    this.setState({
      filter: e
    });
  }

  clearCompleted() {
    const {
      todoActions: { clearCompleted },
      todoList
    } = this.props;
    const tlist = todoList.filter(t => !t.completed);
    clearCompleted &&
      clearCompleted(tlist).then(() => {
        this.fetchData();
      });
  }

  deleteTodo(i) {
    const {
      todoActions: { deleteTodo }
    } = this.props;
    console.log(deleteTodo);

    deleteTodo &&
      deleteTodo(i, () => {
        this.fetchData();
        console.log('3');
      });
  }

  chooseAll() {
    const {
      todoActions: { chooseAll }
    } = this.props;
    chooseAll &&
      chooseAll().then(() => {
        this.fetchData();
      });
  }

  modifyTodo(c, item) {
    const {
      todoActions: { modifyTodo }
    } = this.props;
    modifyTodo &&
      modifyTodo({
        id: item,
        text: c
      }).then(() => {
        this.fetchData();
      });
  }

  render() {
    const { todoList } = this.props;
    const { filter } = this.state;
    console.log(todoList, 'todolist');

    let hasCompleted = 0;
    todoList.length !== 0 &&
      todoList.forEach(v => {
        if (v.completed === true) {
          hasCompleted += 1;
        }
      });
    return (
      <div className="App">
        <h1 className="title">todolist</h1>
        <div className="todo">
          <header>
            <i
              className={`iconfont icon-unfold ${
                todoList.length === todoList.filter(t => t.completed).length ? 'active' : ''
              }`}
              onClick={() => this.chooseAll()}
            />
            <input
              className="todo-new"
              placeholder="what needs to be done?"
              ref={this.input}
              type="text"
              onBlur={() => this.addTodo()}
              onKeyUp={e => this.onKeyup(e)}
            />
          </header>
          <ul className="todo-list">
            {todoList.length !== 0 &&
              todoList.map((v, i) => (
                <TodoItem
                  key={i}
                  onClick={() => this.checkToggle(v.id)}
                  completed={v.completed}
                  text={v.text}
                  deleteTodo={() => this.deleteTodo(v.id)}
                  modifyTodo={c => this.modifyTodo(c, v.id)}
                />
              ))}
          </ul>
          <div className="todo-func">
            <span className="count">{todoList.length} items left</span>
            <ul className="func">
              <li
                className={`${filter === 'All' ? 'active' : ''}`}
                onClick={() => this.checkFilter('All')}
              >
                All
              </li>
              <li
                className={`${filter === 'Active' ? 'active' : ''}`}
                onClick={() => this.checkFilter('Active')}
              >
                Active
              </li>
              <li
                className={`${filter === 'Completed' ? 'active' : ''}`}
                onClick={() => this.checkFilter('Completed')}
              >
                Completed
              </li>
            </ul>
            <span
              className={`clear ${hasCompleted === 0 ? 'show' : ''}`}
              onClick={() => this.clearCompleted()}
            >
              Clear completed
            </span>
          </div>
        </div>

        <footer className="footer">made by zyoung</footer>
      </div>
    );
  }
}

// 把state传给props
const mapStateToProps = state => {
  const { todoList } = state.todos.toJS();
  return {
    todoList
  };
};

// 将action绑定到dispatch,把dispatch传给props
const mapDispatchToProps = dispatch => ({
  todoActions: bindActionCreators(todoActions, dispatch)
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
