import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Todos, PageNotFound } from '../pages/';

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/todos' component={Todos} />
                    <Route component={PageNotFound} />
                </Switch>
            </Router>
        );
    }
}
