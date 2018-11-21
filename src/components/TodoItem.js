import React, { Component } from 'react';

import PropTypes from 'prop-types';

import './TodoItem.scss';

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModify: false
    };
    // this.content = React.createRef();
  }

  componentDidUpdate() {
    this.content.focus();
  }

  onBlur() {
    this.setState({
      isModify: false
    });
  }

  onKeyup(e) {
    const content = this.content.value;
    const { modifyTodo } = this.props;
    if (!!content && e.keyCode === 13) {
      modifyTodo && modifyTodo(content);
      this.setState({
        isModify: false
      });
    }
  }

  modify(e) {
    e.stopPropagation();
    this.setState({
      isModify: true
    });
  }

  render() {
    const { onClick, completed, text, deleteTodo } = this.props;
    const { isModify } = this.state;
    return (
      <li className="TodoItem clearfix">
        <div className={`check ${isModify ? 'hide' : ''}`} onClick={onClick}>
          <input className="check-box" type="checkbox" />
          <i className={`iconfont icon-check ${completed ? 'active' : ''}`} />
        </div>
        <span
          className={`content ${completed ? 'completed' : ''}`}
          onDoubleClick={e => this.modify(e)}
        >
          {text}
        </span>
        <input
          className={`${isModify ? 'show' : ''} modify`}
          type="text"
          ref={input => {
            this.content = input;
          }}
          defaultValue={text}
          onBlur={() => this.onBlur()}
          onKeyUp={e => this.onKeyup(e)}
        />
        <i className="iconfont icon-close" onClick={deleteTodo} />
      </li>
    );
  }
}

TodoItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  modifyTodo: PropTypes.func.isRequired
};

export default TodoItem;
