/**
 * Created by user on 2016/7/19.
 */


import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';


var App = React.createClass({
    render: function () {
        return <div>{this.props.children}</div>
    }
});


const router = [
    {
        path: '/', component: App,
        indexRoute: {
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('./src/component/home'))
                },'home');
            },
        },
        childRoutes: [
            {
                path: 'user',
                indexRoute: {
                    getComponent: (nextState, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('./src/component/user'))
                        },'user');
                    },
                },
                childRoutes: [
                    {
                        path: 'login',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/login'))
                            },'login');
                        },
                    },
                    {
                        path: 'find',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null,require('./src/component/find'))
                            },'find');
                        },
                    },
                    {
                        path: 'resetPassword',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/resetpassword'))
                            },'resetPassword');
                        },
                    },
                    {
                        path: 'chat',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/chat'))
                            },'chat');
                        },
                    },
                    {
                        path: 'update',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/userUpdated'))
                            },'update');
                        },
                    },
                    {
                        path: 'phone',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/phone'))
                            },'phone');
                        },
                    },
                    {
                        path: 'profile',
                        getComponent: (nextState, cb) =>{
                            require.ensure([],(require) => {
                                cb(null,require('./src/component/profile'))
                            },'profile');
                        },
                    }
                ]
            },
            {
                path: 'device',
                indexRoute: {
                    getComponent: (nextState, cb) => {
                        require.ensure([], (require) => {
                            cb(null, require('./src/component/device'))
                        },'device');
                    },
                },
                childRoutes: [
                    {
                        path: 'setting',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/deviceSetting'))
                            },'setting');
                        },
                    },
                    {
                        path: 'alarm',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/alarm'))
                            },'alarm');
                        },
                    },
                    {
                        path: 'list',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/deviceList'))
                            },'list');
                        },
                    },
                    {
                        path: 'add',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/deviceAdd'))
                            },'add');
                        },
                    },
                    {
                        path: 'delete',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/deviceDelete'))
                            },'delete');
                        },
                    },
                    {
                        path: 'change',
                        getComponent: (nextState, cb) => {
                            require.ensure([], (require) => {
                                cb(null, require('./src/component/deviceChange'))
                            },'change');
                        },
                    },
                    {
                        path: 'locate',
                        getComponent: (nextState, cb) => {
                            var script = document.createElement('script');                               //防止异步加载js 出现document.write
                            script.src = 'http://webapi.amap.com/maps?v=1.3&key=38d958d68761d76101760fed094d8049&callback=init';
                            document.getElementsByTagName("head")[0].appendChild(script);
                            script.onload = function () {
                                require.ensure([], (require) => {
                                    cb(null, require('./src/component/locate'))
                                },'locate');
                            };
                        },
                    },
                    {
                        path: 'locus',
                        getComponent: (nextState, cb) => {
                            var script = document.createElement('script');
                            script.src = 'http://webapi.amap.com/maps?v=1.3&key=38d958d68761d76101760fed094d8049&callback=init';
                            document.getElementsByTagName("head")[0].appendChild(script);
                            script.onload = function () {
                                require.ensure([], (require) => {
                                    cb(null, require('./src/component/locus'))
                                },'locus');
                            };
                        },
                    },
                    {
                        path: 'rail',
                        getComponent: (nextState, cb) => {
                            var script = document.createElement('script');
                            script.src = 'http://webapi.amap.com/maps?v=1.3&key=38d958d68761d76101760fed094d8049&callback=init';
                            document.getElementsByTagName("head")[0].appendChild(script);
                            script.onload = function () {
                                require.ensure([], (require) => {
                                    cb(null, require('./src/component/rail'))
                                },'rail');
                            };
                        },
                    }
                ]
            },
            {
                path: '/user/login&code=:ticket&isLogined=:false',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('./src/component/redirect'))
                    },'redirect');
                },
            }
        ]
    }


];
ReactDOM.render(<Router routes={router} history={hashHistory}/>, document.getElementById('app'));
