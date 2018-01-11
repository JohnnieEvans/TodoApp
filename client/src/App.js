import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = { todos: [] };

  componentDidMount() {
    fetch('http://localhost:3001/api/todos')
      .then(res => {
        res.json()
          .then(res => this.setState({ todos: res.todos }));
      });
  }

  _renderTodos = () => (
    this.state.todos.map(todo => <p key={todo._id}>{todo.task}</p>)
  );

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this._renderTodos()}
      </div>
    );
  }
}

export default App;
