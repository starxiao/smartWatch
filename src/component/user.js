/**
 * Created by user on 2016/7/22.
 */


import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import ToastError from './ToastError';
import Dialog from './dialog';
import 'weui';

var User = React.createClass({
    getInitialState: function () {
        return {
            toast:null,     //设置toast
            title:null,    //设置dialog的title
            content:null,   //设置dialog的content
            url: ''
        }

    },
    handleSubmit: function (e) {      //handle submit
        e.preventDefault();              //防止无效提交
        var that = this,
            username = this.refs.username.value.trim(),  //获取输入的用户名
            password = this.refs.password.value.trim(),   //获取输入的密码
            flag = /^1[3,5,8]\d{9}$/,                     //验证手机号码
            ToastError = this.refs.ToastError;
        if(!(flag.test(username))){
            this.setState({toast: "手机号码错误"});
            ToastError.show();
            setTimeout(function () {
                ToastError.hide();
            }, 2000);
            return
        }
        if(password.length<6){    //验证密码
            this.setState({toast: "密码小于6位"});
            ToastError.show();
            setTimeout(function () {
                ToastError.hide();
            }, 2000);
            return
        }
        CreateXHR({                    //get data
            type: 'post',
            url: 'http://api.smartlocate.cn/v1/user/',
            data: {
                username: username,
                password: password
            },
            success: function (data) {
                var dialog = that.refs.dialog;
                switch (data.errcode){         //判断注册是否成功
                    case 0:
                        hashHistory.push("/user/login");
                        break;
                    case 20002:
                        that.setState({title:"注册失败"});
                        that.setState({content:"用户名已存在"});
                        dialog.show();
                        that.refs.username.value = null;
                        that.refs.password.value = null;
                        break;
                    case 44001:    //微信授权
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
    render: function () {
        return (
            <div className="page">
                <header>
                    <div className="weui_cells_title">
                        <div className="weui_cell" style={{display:"flex",justifyContent:"center"}}>
                            <svg className="iconfont locate_img" aria-hidden="true" style={{color:"#A85FE2",width:"10rem",height:"10rem"}}>
                                <use xlinkHref="#icon-yonghu"/>
                            </svg>
                        </div>
                    </div>
                </header>
                <div className="content">
                    <div className="weui_cells weui_cells_form" onSubmit={this.handleSubmit}>
                        <div className="weui_cell">
                            <div className="weui_cell_hd">
                                <label className="weui_label">
                                    <svg className="iconfont" aria-hidden="true" style={{color:"#49E236",display: "block",width:"20px",marginRight:"5px"}}>
                                        <use xlinkHref="#icon-shouji"/>
                                    </svg>
                                </label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="text" ref="username" placeholder="请输入您的手机号码"/>
                            </div>
                        </div>
                        <div className="weui_cell">
                            <div className="weui_cell_hd">
                                <label className="weui_label">
                                    <svg className="iconfont" aria-hidden="true" style={{color:"#49E236",display: "block",width:"20px",marginRight:"5px"}}>
                                        <use xlinkHref="#icon-mima1"/>
                                    </svg>
                                </label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="password" ref="password" placeholder="请输入您的密码"/>
                            </div>
                        </div>
                    </div>
                    <div className="weui_btn_area">
                        <a className="weui_btn weui_btn_primary" href="javascript:" onClick={this.handleSubmit}>注册</a>
                    </div>
                </div>
                <Dialog ref="dialog" title={this.state.title} content={this.state.content}/>
                <ToastError ref="ToastError" toast={this.state.toast}/>
            </div>
        )
    }
});
// export default User;

module.exports = User;