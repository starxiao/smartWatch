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
    DeviceSetting,
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


const router = [
    {
        path: '/', component: App,
        indexRoute: {component: Home},
        // getIndexRoute(location, callback) {
        //     require.ensure([], function () {
        //         callback(null, Home);
        //     });
        // },
        // getChildRoutes(location, callback) {
        //     require.ensure([], function () {
        //         callback(null, [User,Device]);
        //     });
        // },
        childRoutes: [
            {
                path: 'user',
                indexRoute: {component: User},
                childRoutes: [
                    {
                        path: 'login', component: Login,
                    },
                    {
                        path: 'find', component: Find,
                    },
                    {
                        path: 'resetPassword', component: ResetPassword,
                    },
                    {
                        path: 'chat', component: Chat,
                    },
                    {
                        path: 'update', component: UserUpdated,
                    },
                    {
                        path: 'phone', component: Phone,
                    },
                    {
                        path: 'chat', component: Chat,
                    }

                ]
            },
            {
                path: 'device',
                indexRoute: {component: Device},
                childRoutes: [
                    {
                        path: 'setting', component: DeviceSetting,
                    },
                    {
                        path: 'alarm', component: Alarm,
                    },
                    {
                        path: 'list', component: DeviceList,
                    },
                    {
                        path: 'add', component: DeviceAdd,
                    },
                    {
                        path: 'delete', component: DeviceDelete,
                    },
                    {
                        path: 'change', component: DeviceChange,
                    },
                    {
                        path: 'locate', component: Locate,
                    },
                    {
                        path: 'locus', component: Locus,
                    },
                    {
                        path: 'rail', component: Rail,
                    }
                ]
            },
            {
                path: '/login&code=:ticket&isLogined=:false', component: Redirect,
            }
        ]
    }


];
ReactDOM.render(<Router routes={router} history={hashHistory}/>, document.getElementById('app'));

// ReactDOM.render((
//     <Router history={hashHistory}>
//         <Route path="/" component={App}>
//             <IndexRoute component={MyHome}/>
//             <Route path="user" component={User}/>
//             <Route path="find" component={Find}/>
//             <Route path="alarm" component={Alarm}/>
//             <Route path="login" component={Login}/>
//             <Route path="setting" component={Setting}/>
//             <Route path="deviceList" component={DeviceList}/>
//             <Route path="deviceAdd" component={DeviceAdd}/>
//             <Route path="deviceDelete" component={DeviceDelete}/>
//             <Route path="deviceChange" component={DeviceChange}/>
//             <Route path="login&code=:ticket&isLogined=:false" component={Redirect}/>
//             <Route path="resetPassword" component={ResetPassword}/>
//             <Route path="userUpdated" component={UserUpdated}/>
//             <Route path="device" component={Device}/>
//             <Route path="phone" component={Phone}/>
//             <Route path="chat" component={Chat}/>
//
//
//             <Route path="locate" component={Locate}/>
//             <Route path="locus" component={Locus}/>
//             <Route path="rail" component={Rail}/>
//         </Route>
//     </Router>
// ), document.getElementById('app'));