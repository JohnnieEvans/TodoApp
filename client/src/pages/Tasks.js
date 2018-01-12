import React, { Component } from 'react';
import axios from 'axios';

import TableRow from './components/TableRow';

export default class Tasks extends Component {
    state = { tasks: [], query: '', active: 0 };

    // Set state of tasklist before page loads
    componentWillMount() {
        this._getTasks();
    }

    // GET array of all tasks and insert into tasks state
    _getTasks = () => {
        fetch('http://localhost:3001/api/todos')
            .then(res => {
                res.json()
                .then(res => this.setState({ tasks: res.todos }));
            });
        fetch('http://localhost:3001/api/todos?show=active')
            .then(res => {
                res.json()
                .then(res => this.setState({ active: res.todos.length }));
            });
    };

    // DELETE task with id
    _delete = (id) => {
        axios.delete(`http://localhost:3001/api/delete/${id}`)
            .then(() => this._getTasks())
            .catch(e => console.log(e));
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

    // DELETE all completed tasks
    _deleteCompleted = () => {
        axios.delete(`http://localhost:3001/api/delete`)
            .then(() => this._getTasks())
            .catch(e => console.log(e));
    };

    // POST task 
    _addTask = (e) => {
        e.preventDefault();

        let task = e.target.task.value;

        axios.post('http://localhost:3001/api/todos', { task })
            .then(() => this._getTasks())
            .catch((error) => console.log(error));

        e.target.task.value = '';
    };

    // Change viewable tasks
    _changeDisplay = (view) => {
        switch(view) {
            case 'priority':
                fetch('http://localhost:3001/api/todos?show=priority')
                    .then(res => {
                        res.json()
                        .then(res => this.setState({ tasks: res.todos }));
                    });
                break;
            case 'active':
                fetch('http://localhost:3001/api/todos?show=active')
                    .then(res => {
                        res.json()
                        .then(res => this.setState({ tasks: res.todos }));
                    });
                break;
            default:
                this._getTasks();
                break;
        }
    } 

    // Update query state for live search
    _updateQuery = (e) => this.setState({ query: e.target.value });

    // PATCH task with id and change values of completed and priority
    _toggleActive = (id, completed, priority) => {
        axios.patch(`http://localhost:3001/api/patch/${id}?completed=${completed}&&priority=${priority}`)
            .then(() => this._getTasks())
            .catch(e => console.log(e));
    };

    render() {
        return (
            <div style={{textAlign:'center'}}>
                <br />
                <h1><u>Todo Web App</u></h1>
                <div>
                    <p>
                        Live Search:&nbsp;
                        <input name='query' type='text' onKeyUp={this._updateQuery} />
                    </p>
                </div>
                <div>
                    <p>
                        <a className='clickable' onClick={() => this._changeDisplay('priority')}>Show Priority</a>
                        &nbsp;|&nbsp;
                        <a className='clickable' onClick={() => this._changeDisplay('active')}>Show Active</a>
                        &nbsp;|&nbsp;
                        <a className='clickable' onClick={() => this._changeDisplay()}>Show All</a>
                    </p>
                </div>
                <p>{`You have ${this.state.active} active task${this.state.active > 1 ? 's' : ''}.`}</p>
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
                <div>
                    <form onSubmit={this._addTask}>
                        <input type="text" name='task' />
                        <button>Add Task</button>
                    </form>
                </div>
                <div>
                    <button onClick={() => this._deleteCompleted()} style={{color: 'white', backgroundColor: 'red'}}>Delete Completed</button>
                </div>
            </div>
        );
    }
}
