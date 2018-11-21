# Redux浅析

首先，redux是什么？为什么我们要用redux呢？

![](https://image.ibb.co/f35cXf/2018-11-03-9-06-31.png)



随着应用越来越大，我们会发现会有很多数据需要管理。如果一个 model 的变化会引起另一个 model 变化，那么当 view 变化时，就可能引起对应 model 以及另一个 model 的变化，依次地，可能会引起另一个 view 的变化。直至你搞不清楚到底发生了什么。![](https://ws3.sinaimg.cn/large/6af89bc8gw1f8qb2wiz63g20100150jf.gif)


#### <font color="red">所以！！我们需要redux来帮助我们管理错综复杂的state!</font>
当然如果你的应用使用方式很简单，没有太多复杂数据交互的时候，你也可以不用

毕竟子曾经曰过：

>"如果你不知道是否需要 Redux，那就是不需要它。"  
>
>"只有遇到 React 实在解决不了的问题，你才需要 Redux 。"


如图，是redux的简单流程

![](https://preview.ibb.co/m7D17f/2018-11-02-9-55-26.png)

 
--> 用户对界面进行一些操作触发action    

<p style="text-indent: 2em">-->  action经过一些中间件被传到reducer中  </p>  
<p style="text-indent: 4em">-->  reducer对action和preState作出一些骚操作，并返回一个新的state     </p>
<p style="text-indent: 6em">-->  将新的state传给界面展示出来</p>

<br/>

简单解释一下这些是什么


**action**：
是一个对象，还是个有type的对象，描述我要干啥。比如：{ type：‘买碗热干面’，money:"1.5" }

**middleware**：
中间件，内部骚操作（后议）。比如你给的是美元，我给你换成人民币

**state**：
某一时间点的数据集合。比如要买热干面肯定要有钱吧，现在有五块钱，这就是我现在的state

**reducer**：
纯函数，在当前state执行action，返回新的state。比如你给我五块钱去买热干面，花了一块五，还剩三块五，返回的新的state的钱就只有三块五了

**store**：
保存所有数据的地方（可能这就是大佬吧）

<br/>


从代码上看，如下是redux提供的几个主要函数：

首先通过 createStore 创建 store 

```
store = createStore(reducer, preloadedState, enhancer)

```

store 这个对象还提供了跟多方法供外接调用，例如:

```
store.subscribe(listener)
``` 

监听 Redux 中 state 的变化，一旦Redux中的state发生了变化，render函数就会被调用，页面就会被重新渲染

```
store.dispatch(action)
```

更新状态，分发action和当前状态到reducer，reducer会返回一个新的状态

```
state = store.getState()
``` 

获取当前状态

```
rootReducer = combineReducers(reducers)
```  

reducer可以根据功能拆分成很多个reducer，通过combineReducer将多个reducer组合成一个

```
bindActionCreators(actionCreators, dispatch)
``` 

绑定action和dispatch  相当于dispatch(action)

<br/>

![](https://ws4.sinaimg.cn/bmiddle/6af89bc8gw1f8qgle07osg205a04raa4.gif)	

<br/>
那
	
.
	
.
	
.

	
	
	
	
![](https://ws2.sinaimg.cn/bmiddle/9150e4e5ly1fswbux3qi6j206y06cmx4.jpg)

```
// 计数器，可以进行加减计数
const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
  <h1>{value}</h1>
  <button onClick={onIncrement}>+</button>
  <button onClick={onDecrement}>-</button>
  </div>
);

// reducer，默认state为0，接收到INCREMENT时，数字+1，DECREMENT数字-1
const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    default: return state;
  }
};

// 创建store
const store = createStore(reducer);

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}  //获取当前状态（0）作为初值
      onIncrement={() => store.dispatch({type: 'INCREMENT'})} //点击按钮时dispatch action
      onDecrement={() => store.dispatch({type: 'DECREMENT'})}
    />,
    document.getElementById('root')
  );
};

render();
store.subscribe(render); // 监听state的变化并重新渲染界面

```

<br/>

-------------
<p style="text-align:center ;color:#999999">这是两条分割线</p>

----------------

<br/>

知道了 redux 那怎么优雅的结合react和redux呢  

于是......

![](https://ws1.sinaimg.cn/bmiddle/9150e4e5gy1fsfogx9d7sj204q03st96.jpg)

就有了react-redux


react-redux源码比较复杂，就不一一分析了，我知道你们也不想看（我也没太细看![](https://ws3.sinaimg.cn/large/9150e4e5ly1fmdxen7y03j201t01mglj.jpg))

直接拿栗子讲吧



以 todomvc 为例,要添加一个代办事项，经历了什么


以下代码见 feature/reduxTodo 分支


目录结构（按道理应该是介个样子滴，但是我没完全按这个写）:

- actions ：放置action
- components ： UI组件，只负责UI呈现，没有交互，数据全由props传入
- container ： 容器组件，处理业务逻辑，管理数据
- reducer ： 放置reducer
- index.js ： 顶层组件 




#### action/todoAction.js


```
const ADD_TODO = 'ADD_TODO';
let nextTodoId = 0;
export const addTodo = text => ({
  type: ADD_TODO,       // 一般用字符串常量作为type，防止字符串会出现重复
  id: nextTodoId++,
  completed: false
  text
});
```


包含很多 action，导出的是对象形式，函数名即为键名。  
以 addTodo 为例，该对象需要 type、id、completed(是否已完成的状态) 和 text(todo事项描述)

#### reducers/todo.js

```
const todos = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          id: action.id,
          text: action.text,
          completed: false
        }
      ];
  }

```


输入当前 state 和 action ，根据 action.type 区分不同 action，并对 state 进行一些操作后返回新的 state 。对 addTodo 即为将新的对象加入到之前的对象数组中。

#### container/APP.js


```

handler() {
	const {
	  todoActions: { addTodo }
	} = this.props;
	!!this.input.current.value && addTodo && addTodo(this.input.current.value);
	this.input.current.value = '';
}
......

<input
  className="todo-new"
  placeholder="what needs to be done?"
  ref={this.input}
  type="text"
  onBlur={() => this.handler()}
  onKeyUp={e => this.onKeyup(e)}
/>
......
            
// 把state传给props
const mapStateToProps = state => ({
  todoList: state.todos
});

// 将action绑定到dispatch
const mapDispatchToProps = dispatch => ({
  todoActions: bindActionCreators(todoActions, dispatch)
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

```

这里比较重要的是 connect() 方法  

connect(mapStateToProps, mapDispatchToProps)(MyComponent)
connet 可接受四个参数，这里主要介绍前两个。

mapStateToProps：负责输入逻辑，将 state 映射到组件参数props中。接受 state 作为参数，返回一个对象，里面每一个键值对就是一个映射。当然你也可以对 `state.todos` 进行一些操作再传给 todoList（个人不建议了，感觉很乱）

mapDispathcToProps：负责输出逻辑，将用户对UI的操作映射成Action。接受dispatch和ownProps（容器组件props对象）作为参数，返回的也是个对象。键值是一个函数用于dispatch action。

#### index.js

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import store from './store/store';
import rootReducer from '../reducers';

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

因为 store 有且只有一个，而我们需要将 redux 中的数据传给 react 使用，所以需要在顶层将 store 传入，再一层一层往下传给组件。
而react-redux提供了`<provider>`组件，让容器组件可以通过 connect 方法拿到 state

<br/>

----------------

<br/>

### 最后，谈谈redux的中间件

redux的中间件就有很多了，常见的比如

<font color="blue">redux-thunk</font> — 用最简单的方式搭建异步 action 构造器，有了这个就可以在action里写异步函数了

<font color="blue">redux-promise</font> — 遵从 FSA 标准的 promise 中间件

<font color="blue">redux-logger</font> — 记录所有 Redux action 和下一次 state 的日志

<font color="blue">redux-devtools-extension</font> - 浏览器中可以查看redux的变化


时间原因就不细说了

可能有下回分解





 
![](https://ws2.sinaimg.cn/large/6af89bc8gw1f8qe58c6zyj205i05ijra.jpg)


最后附上链接  https://todo-dvyfiyaggf.now.sh


