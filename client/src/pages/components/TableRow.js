import React, { Component } from 'react';

export default class TableRow extends Component {
    // Set className value for table row based on if task is completed or a priority
    _className = (priority, completed) => {
        let name;
        priority ? name = "priority" : this.name = name;
        completed ? name = "completed" : this.name = name;
    
        return name;
    }

    // Set checkmark based on if task is completed
    _checkmark = (id, priority, completed) => {
        let jsx;

        completed 
        ? 
        jsx = (
            <a onClick={() => this.props.toggleActive(id, !completed, priority)}>
                <i className="fas fa-check inactive"></i>
            </a> 
        )
        : 
        jsx = (
            <a onClick={() => this.props.toggleActive(id, !completed, priority)}>
                <i className="fas fa-check clickable"></i>
            </a> 
        )

        return jsx;
    }

    // Set exclamation based on if task is a priority
    _exclamation = (id, priority, completed) => {
        let jsx;

        priority 
        ? 
        jsx = (
            <a onClick={() => this.props.toggleActive(id, completed, !priority)}>
                <i className="fas fa-exclamation clickable"></i>
            </a>
        ) 
        : 
        jsx = (
            <a onClick={() => this.props.toggleActive(id, completed, !priority)}>
                <i className="fas fa-exclamation inactive"></i>
            </a>
        )

        return jsx;
    }

    render() {
        let { data, deleteTask } = this.props;

        return (
            <tr className={this._className(data.priority, data.completed)}>
                <td>&nbsp;{this._exclamation(data._id, data.priority, data.completed)}</td>
                <td>{this._checkmark(data._id, data.priority, data.completed)}</td>
                <td>{data.task}</td>
                <td><a onClick={() => deleteTask(data._id)}><i className="fas fa-trash-alt clickable"></i></a></td>
            </tr>
        );
    }
}
