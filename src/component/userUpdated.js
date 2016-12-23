/**
 * Created by user on 2016/8/12.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import ToastError from './ToastError';
import ToastSuccess from './ToastSuccess';
import 'weui';

var UserUpdated = React.createClass({
    getInitialState: function () {
        return {
            toastError: null,     //init toast
            toastSuccess: null,
        }
    },

    handleClick: function () {

        var ticket = Cookie("ticket"),
            username = this.refs.username.value.trim(),
            oldPassword = this.refs.oldPassword.value.trim(),    //get olPassword
            newPassword_0 = this.refs.newPassword_0.value.trim(),  //get newPassword
            newPassword_1 = this.refs.newPassword_1.value.trim(),
            successToast = this.refs.successToast,
            errorToast = this.refs.errorToast,
            flag = /^1[3,5,8]\d{9}$/,
            that = this;

        if (!(flag.test(username))) {                  //验证手机号码
            that.setState({toastError: "手机号码错误"});
            errorToast.show();
            setTimeout(function () {
                errorToast.hide();        //after two second  this hide
            }, 2000);
            return
        }
        if (oldPassword.length < 6) {                  //confirm password
            that.setState({toastError: "原密码小于6位"});
            errorToast.show();
            setTimeout(function () {
                errorToast.hide();
            }, 2000);
            return
        }
        if (newPassword_0.length < 6) {                  //confirm password
            that.setState({toastError: "新密码小于6位"});
            errorToast.show();
            setTimeout(function () {
                errorToast.hide();
            }, 2000);
            return
        }
        if (newPassword_0 != newPassword_1) {                  //confirm password
            that.setState({toastError: "新密码不一致"});
            errorToast.show();
            setTimeout(function () {
                errorToast.hide();
            }, 2000);
            return
        }
        CreateXHR({
            url: "http://api.smartlocate.cn/v1/user/" + username,
            type: "put",
            data: {
                ticket: ticket,
                oldPassword: oldPassword,
                newPassword: newPassword_0
            },
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({toastSuccess: "修改成功"});
                        successToast.show();
                        setTimeout(function () {
                            successToast.hide();
                        }, 2000);
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        that.setState({toastError: "修改失败"});
                        errorToast.show();
                        setTimeout(function () {
                            errorToast.hide();
                        }, 2000);
                        break;
                }
            },
        });

        that.refs.username.value = null;     //init input
        that.refs.oldPassword.value = null;
        that.refs.newPassword_0.value = null;
        that.refs.newPassword_1.value = null;
    },

    render: function () {
        return (
            <div className="UpdatedPage page">
                <div className="weui_cells weui_cells_form">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">手机号码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="weui_input" type="text" placeholder="输入手机号码" ref="username"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">原密码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="weui_input" type="password" placeholder="输入原密码" ref="oldPassword"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">新密码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="weui_input" type="password" placeholder="输入新密码" ref="newPassword_0"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">新密码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="weui_input" type="password" placeholder="再次输入新密码" ref="newPassword_1"/>
                        </div>
                    </div>
                </div>
                <div className="weui_btn_area">
                    <a className="weui_btn weui_btn_primary" onClick={this.handleClick}>提交</a>
                </div>
                <ToastError ref="errorToast" toast={this.state.toastError}/>
                <ToastSuccess ref="successToast" toast={this.state.toastSuccess}/>
            </div>
        )
    }
});


// export default UserUpdated;

module.exports = UserUpdated;