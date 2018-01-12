import React, { Component } from 'react';

export default class TableRow extends Component {
    state = {};

    _className = (priority, completed) => {
        let name;
        priority ? name = "priority" : this.name = name;
        completed ? name = "completed" : this.name = name;
    
        return name;
    }

    _toggleEdit = () => {};

    _delete = (id) => {
    };

    render() {
        let { data } = this.props;

        return (
            <tr className={this._className(data.priority, data.completed)}>
                <td>&nbsp;{ data.priority ? <i className="fas fa-exclamation"></i> : undefined }</td>
                <td>{data.task}</td>
                <td><a onClick={this._toggleEdit()}><i className="fas fa-edit"></i></a></td>
                <td><a onClick={this._delete(data._id)}><i className="fas fa-trash-alt"></i></a>&nbsp;</td>
            </tr>
        );
    }
}
