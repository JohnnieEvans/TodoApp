import React, { Component } from 'react';
import axios from 'axios';

import TableRow from './components/TableRow';

export default class Tasks extends Component {
    state = { tasks: [], query: '' };

    // Set state of todolist before page loads
    componentWillMount() {
        this._getTasks();
    }

    // GET array of all tasks and insert into todo state
    _getTasks = () => {
        fetch('http://localhost:3001/api/todos')
            .then(res => {
                res.json()
                .then(res => this.setState({ tasks: res.todos }));
            });
    }

    // DELETE task with id
    _delete = (id) => {
        let update = this.state.todos.filter(todo => todo._id !== id);
        this.setState({ todos: update });

        axios.delete(`http://localhost:3001/api/delete/${id}`);
    };

    // Render table data using the reusable component TableRow
    _renderTasks = () => {
        if (this.state.query.trim() === '') {
            return this.state.tasks.map(task => 
                <TableRow 
                    data={task} 
                    key={`${task._id}-${task.completed}-${task.priority}`} 
                    deleteTask={this._delete} 
                    toggleActive={this._toggleActive} 
                />
            );
        }
        let filteredTasks = this.state.tasks.filter(task => task.task.toLowerCase().includes(this.state.query.toLowerCase().trim()));

        return filteredTasks.map(task => 
            <TableRow 
                data={task} 
                key={`${task._id}-${task.completed}-${task.priority}`} 
                deleteTask={this._delete} 
                toggleActive={this._toggleActive} 
            />
        );
    };

    // POST task 
    _addTask = (e) => {
        e.preventDefault();

        let task = e.target.task.value;

        axios.post('http://localhost:3001/api/todos', { task })
            .then(res => {
                console.log(res);
                this._getTasks();
            })
            .catch((error) => console.log(error));

        e.target.task.value = '';
    };

    // Update query state for live search
    _updateQuery = (e) => this.setState({ query: e.target.value });

    // PATCH task with id and change values of completed and priority
    _toggleActive = (id, completed, priority) => {
        axios.patch(`http://localhost:3001/api/patch/${id}?completed=${completed}&&priority=${priority}`)
            .then((res) => {
                console.log(res);
            })
            .then(() => this._getTasks());
    };

    render() {
        return (
            <div>
                <br />
                <div style={{textAlign:'center'}}>
                    <input className='searchbar' name='query' type='text' onKeyUp={this._updateQuery} />
                </div>
                <table style={{margin: "0 auto"}}>
                    <thead>
                        <tr>
                            <td>Priority</td>
                            <td>Active</td>
                            <td>Task</td>
                            <td>Delete</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this._renderTasks()}
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
