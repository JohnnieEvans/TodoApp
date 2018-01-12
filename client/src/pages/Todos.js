import React, { Component } from 'react';
import axios from 'axios';

import TableRow from './components/TableRow';

export class Todos extends Component {
    state = { todos: [] };

    componentWillMount() {
        this._getTasks();
    }

    _getTasks = () => {
        fetch('http://localhost:3001/api/todos')
            .then(res => {
                res.json()
                .then(res => this.setState({ todos: res.todos }));
            });
    }

    _renderTodos = () => (
        this.state.todos.map(todo => <TableRow data={todo} key={todo._id} />)
    );

    _addTask = (e) => {
        let task = e.target.task.value

        axios.post('http://localhost:3001/api/todos', { task })
            .then(res => console.log(res))
            .catch((error) => console.log(error));
    };

    render() {
        return (
            <div>
                <table style={{margin: "0 auto"}}>
                    <thead>
                        <tr>
                            <td>Priority</td>
                            <td>Task</td>
                            <td>Edit</td>
                            <td>Delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this._renderTodos()}
                    </tbody>
                </table>
                <br />
                <div style={{textAlign: "center"}}>
                    <form onSubmit={this._addTask}>
                        <input type="text" name='task' />
                        <button>Add Task</button>
                    </form>
                </div>
            </div>
        );
    }
}
