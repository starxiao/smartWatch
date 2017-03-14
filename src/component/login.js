/**
 * Created by user on 2016/7/20.
 */


import React from 'react';
import {hashHistory,Link} from 'react-router';

import Cookie from './cookie';
import CreateXHR from './xhr';
import ToastError from './ToastError';
import Dialog from './dialog';
import 'weui';
import '../styles/login.css';


var Login = React.createClass({
    getInitialState: function () {
        return {
            toast: null,    //set toast
            title: null,    //set dialog title
            content: null,   //set dialog content
            url: null,
        }
    },
    componentWillMount:function(){
        if(!(Cookie('code'))){
            var url = encodeURIComponent(window.location.href);
            window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?redirectUri=" + url;
        }
    },
    HandleSubmit: function (e) {
        e.preventDefault();
        var that = this,
            code = Cookie('code'),
            username = this.refs.username.value.trim(),
            password = this.refs.password.value.trim(),
            flag = /^1[3,5,8]\d{9}$/,
            ToastError = that.refs.ToastError;
        if (!(flag.test(username))) {                           //验证手机号码
            that.setState({toast: "手机号码错误"});
            ToastError.show();
            setTimeout(function () {
                ToastError.hide();
            }, 2000);
            return

        }
        if (password.length < 6) {                              //验证密码
            that.setState({toast: "密码小于6位"});
            ToastError.show();
            setTimeout(function () {
                ToastError.hide();
            }, 2000);
            return
        }
        CreateXHR({
            url: "http://api.smartlocate.cn/v1/user/" + username + "/login",
            type: "post",
            data: {
                password:password,
                code:code
            },
            success: function (data) {
                var dialog = that.refs.dialog;
                switch (data.errcode) {
                    case 0:
                        Cookie("username", username);    //store username and ticket
                        Cookie("ticket", data.data.ticket);    //store username and ticket
                        hashHistory.push('/');   //redirect url
                        break;
                    case 20003:
                        that.setState({title: "登录失败"});
                        that.setState({content: "用户名不存在"});
                        dialog.show();
                        that.refs.username.value = '';
                        that.refs.password.value = '';
                        break;
                    case 20004:
                        that.setState({title: "登录失败"});
                        that.setState({content: "用户密码错误"});
                        dialog.show();
                        that.refs.password.value = '';
                        break;
                    case 40001:
                        var myUrl = encodeURIComponent("http://app.smartlocate.cn/build/build.html#/user/login");
                        window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?" +
                            "redirectUri=" + myUrl;
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        hashHistory.push('/user/login');
                        break;
                }
            },
            error: function () {
                that.setState({toast: "网络错误"});
                ToastError.show();
                setTimeout(function () {
                    ToastError.hide();
                }, 2000);
            }
        });
    },
    getPassword: function () {
        hashHistory.push('/user/resetPassword');
    },
    alterPassword: function () {
        hashHistory.push('/user/resetPassword');
    },
    render: function () {
        return (
            <div className="loginPage page">
                <header>
                    <div className=" weui_cells_title">
                        <div className="weui_cell">
                            <svg className="iconfont locate_img" aria-hidden="true" style={{color:"#27E27C",width:"10rem",height:"10rem"}}>
                                <use xlinkHref="#icon-dingwei1"/>
                            </svg>
                        </div>
                    </div>
                </header>
                <div className="content">
                    <div className="weui_cells weui_cells_form">
                        <div className="weui_cell">
                            <div className="weui_cell_hd">
                                <label className="weui_label">
                                    <svg className="iconfont" aria-hidden="true" style={{color:"#49E236"}}>
                                        <use xlinkHref="#icon-shouji"/>
                                    </svg>
                                </label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="text" name="username" placeholder="请输入您的手机号码"
                                       ref="username"/>
                            </div>
                        </div>
                        <div className="weui_cell">
                            <div className="weui_cell_hd">
                                <label className="weui_label">
                                    <svg className="iconfont" aria-hidden="true" style={{color:"#49E236"}}>
                                        <use xlinkHref="#icon-mima1"/>
                                    </svg>
                                </label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="password" name="password" placeholder="请输入您的密码"
                                       ref="password"/>
                            </div>
                        </div>
                    </div>
                    <div className="weui_btn_area">
                        <a className="weui_btn weui_btn_primary" href="javascript:;" onClick={this.HandleSubmit}>登录</a>
                    </div>
                    <div className="passwordUpdated weui_btn_area">
                        <span onClick={this.getPassword}>忘记密码</span>
                        <span onClick={this.alterPassword}>修改密码</span>
                    </div>
                </div>
                <footer>
                    <div className="weui_cells weui_cells_access">
                        <Link to='/user' className="weui_cell">
                            <div className="weui_cell_hd weui_cell_primary">没有账户?</div>
                            <div className="weui_cell_ft weui_cell_primary">马上注册</div>
                        </Link>
                    </div>
                </footer>
                <Dialog ref="dialog" title={this.state.title} content={this.state.content}/>
                <ToastError ref="ToastError" toast={this.state.toast}/>
            </div>
        )
    }
});

// export default Login;


module.exports = Login;