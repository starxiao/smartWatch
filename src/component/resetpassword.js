/**
 * Created by user on 2016/8/10.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import Dialog from './dialog';
import ToastError from './ToastError';
import 'weui';

var ResetPassword = React.createClass({
    getInitialState: function () {
        return {
            toast: null,  //init toast
            title:null,
            content:null
        }
    },
    handleCode: function () {
        var that = this,
            username = that.refs.username.value.trim(),    //get username
            flag = /^1[3,5,8]\d{9}$/,      //验证手机号码
            errorToast = that.refs.errorToast,
            dialog = that.refs.dialog;

        if (!(flag.test(username))) {
            that.setState({toast: "手机号码错误"});
            errorToast.show();
            setTimeout(function () {
                errorToast.hide();        //after two second  this hide
            }, 2000);
            return
        }
        CreateXHR({                                        //get data
            type: "get",
            url: "http://api.smartlocate.cn/v1/user/"+username+"/SMSCode",
            dataType: "json",
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({title:"验证码"});
                        that.setState({content:data.errmsg});            //get code
                        dialog.show();
                        break;
                    case 20003:
                        that.setState({toast:data.errmsg});
                        errorToast.show();
                        setTimeout(function () {
                            errorToast.hide();
                        }, 2000);
                        break;
                    case 20010:
                        that.setState({toast: data.errmsg});
                        errorToast.show();
                        setTimeout(function () {
                            errorToast.hide();
                        }, 2000);
                        break;
                    case 20011:
                        that.setState({toast: data.errmsg});
                        errorToast.show();
                        setTimeout(function () {
                            errorToast.hide();
                        }, 2000);
                        break;
                    case 44001:
                        hashHistory.push("/user/login");
                        break;
                    default:
                        break;
                }
            },
            error: function (xhr) {
                console.error(xhr.status+xhr.statusText);
            }
        })
    },
    handleClick: function () {
        var that =this,
            username = that.refs.username.value.trim(),
            password = that.refs.password.value.trim(),    //get password
            code = that.refs.code.value.trim(),          //get code
            errorToast = that.refs.errorToast;
        if (code.length != 6) {               //confirm code
            that.setState({toast: "请正确输入验证码"});
            errorToast.show();
            setTimeout(function () {
                errorToast.hide();
            }, 2000);
            return
        }
        if (password.length < 6) {                  //confirm password
            that.setState({toast: "密码小于6位"});
            errorToast.show();
            setTimeout(function () {
                errorToast.hide();
            }, 2000);
            return
        }
        CreateXHR({
            type: "post",
            url: "http://api.smartlocate.cn/v1/user/"+username+"/resetPassword",
            dataType: "json",
            data:{
                password:password,
                SMScode:code
            },
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        Cookie("username",username);    //store username and ticket
                        Cookie("ticket",data.data.ticket);    //store username and ticket
                        hashHistory.push ("/user/login");   //redirect url
                        break;
                    case 20003:
                        that.setState({toast: data.errmsg});
                        errorToast.show();
                        setTimeout(function () {
                            errorToast.hide();
                        }, 2000);
                        break;
                    case 200013:
                        that.setState({toast: data.errmsg});
                        errorToast.show();
                        setTimeout(function () {
                            errorToast.hide();
                        }, 2000);
                        break;
                    case 200014:
                        that.setState({toast: data.errmsg});
                        errorToast.show();
                        setTimeout(function () {
                            errorToast.hide();
                        }, 2000);
                        break;
                    case 44001:
                        hashHistory.push("/user/login");
                        break;
                    default:
                        break;
                }
            },
            error: function (xhr) {
                console.error(xhr.status + xhr.statusText);
            }
        });
        that.refs.username.value = null;     //init input
        that.refs.code.value = null;
        that.refs.password.value = null;
    },
    render: function () {
        return (
            <div className="page">
                <div className="weui_cells">
                    <div className="weui_cell weui_cell_select weui_select_before">
                        <div className="weui_cell_hd">
                            <select className="weui_select" name="select2">
                                <option value="1">+86</option>
                                <option value="2">+80</option>
                                <option value="3">+84</option>
                                <option value="4">+87</option>
                            </select>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="weui_input" type="number" pattern="[0-9]*" placeholder="请输入号码"
                                   ref="username"/>
                        </div>
                    </div>
                    <div className="weui_cell weui_cell_vcode">
                        <div className="weui_cell_hd">
                            <label className="weui_label">验证码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="weui_input" type="text" placeholder="输入验证码" ref="code"/>
                        </div>
                        <div className="weui_cell_ft" onClick={this.handleCode}>点击获取验证码</div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">新密码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="weui_input" type="password" placeholder="输入新密码" ref="password"/>
                        </div>
                    </div>
                </div>
                <div className="weui_btn_area">
                    <a className="weui_btn weui_btn_primary" onClick={this.handleClick}>提交</a>
                </div>
                <ToastError ref="errorToast" toast={this.state.toast}/>
                <Dialog ref="dialog" title={this.state.title} content={this.state.content}/>
            </div>
        )
    }
});

// export default ResetPassword;
module.exports = ResetPassword;