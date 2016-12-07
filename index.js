/**
 * Created by user on 2016/7/19.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';

import {
    Home,
    User,
    Find,
    Alarm,
    Setting,
    Login,
    DeviceList,
    DeviceAdd,
    DeviceDelete,
    DeviceChange,
    ResetPassword,
    UserUpdated,
    Redirect,
    Device,
    Phone,
    MyHome,
    Chat,

    Locate,
    Rail,
    Locus,
} from './src/component';

var App = React.createClass({
    render: function () {
        return <div>{this.props.children}</div>
    }
});


ReactDOM.render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={MyHome}/>
            <Route path="user" component={User}/>
            <Route path="find" component={Find}/>
            <Route path="alarm" component={Alarm}/>
            <Route path="login" component={Login}/>
            <Route path="setting" component={Setting}/>
            <Route path="deviceList" component={DeviceList}/>
            <Route path="deviceAdd" component={DeviceAdd}/>
            <Route path="deviceDelete" component={DeviceDelete}/>
            <Route path="deviceChange" component={DeviceChange}/>
            <Route path="login&code=:ticket&isLogined=:false" component={Redirect}/>
            <Route path="resetPassword" component={ResetPassword}/>
            <Route path="userUpdated" component={UserUpdated}/>
            <Route path="device" component={Device}/>
            <Route path="phone" component={Phone}/>
            <Route path="chat" component={Chat}/>


            <Route path="locate" component={Locate}/>
            <Route path="locus" component={Locus}/>
            <Route path="rail" component={Rail}/>
        </Route>
    </Router>
), document.getElementById('app'));