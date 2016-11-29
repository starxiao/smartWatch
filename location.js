/**
 * Created by user on 2016/9/21.
 */



import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import {
    Locate,
    Locus,
    Rail,
} from './src/component';

var App = React.createClass({
    render: function () {
        return <div>{this.props.children}</div>
    }
});


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Locate}/>
            <Route path="locus" component={Locus}/>
            <Route path="rail" component={Rail}/>
        </Route>
    </Router>
), document.getElementById('app'));