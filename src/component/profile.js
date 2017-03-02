/**
 * Created by user on 2016/12/23.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';
import ToastError from './ToastError';
import ToastSuccess from './ToastSuccess';
import 'weui';
var Profile = React.createClass({
    getInitialState: function () {
        return {
            toast:'',
            nick:'',
            sex:'',
            realName:'',
            telephone:''
        }
    },
    componentWillMount:function () {

        var that = this,
            username = Cookie('username'),
            ticket = Cookie('ticket');

        CreateXHR({
            url: 'http://api.smartlocate.cn/v1/user/' + username + "?ticket=" + ticket,
            type: "GET",
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        console.log(data);
                        that.refs.profileVal.value = data.data.nick;
                        that.refs.nameVal.value = data.data.realname;
                        that.refs.phoneVal.value = data.data.telephone;
                        if(data.data.sex === 2){
                            that.refs.girl.checked = 'checked';
                        }else{
                            that.refs.boy.checked = 'checked';
                        }
                        break;
                    default:
                        hashHistory.push('/user/login');
                        break;
                }
            },
            error: function () {
                that.refs.ToastError.show();
                setTimeout(function () {
                    that.refs.ToastError.hide();
                }, 2000);
            }
        });

    },
    handleSubmit:function () {
        var that = this,username = Cookie('username'),ticket = Cookie('ticket');
        var profileVal = that.refs.profileVal.value,
            nameVal = that.refs.nameVal.value,
            phoneVal = that.refs.phoneVal.value;
        var sexVal = 0;
        if(that.refs.boy.checked){
            sexVal = 1;
        }
        if(that.refs.girl.checked){
            sexVal = 2;
        }
        if(!profileVal){
            that.setState({toast:'帐号未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else if(!sexVal){
            that.setState({toast:'性别未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else if (!nameVal){
            that.setState({toast:'姓名未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else if (!phoneVal){
            that.setState({toast:'电话未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else{

            CreateXHR({
                url: 'http://api.smartlocate.cn/v1/user/' + username,
                type: "PUT",
                data:{
                    ticket: ticket,
                    nick: profileVal,
                    sex: sexVal,
                    realname: nameVal,
                    telephone: phoneVal
                },
                success: function (data) {
                    that.setState({toast:'保存成功'});
                    that.refs.ToastSuccess.show();
                    window.setTimeout(function () {
                        that.refs.ToastSuccess.hide();
                    },1000);
                },
                error: function () {
                    that.refs.ToastError.show();
                    setTimeout(function () {
                        that.refs.ToastError.hide();
                    }, 2000);
                }
            });

        }
    },
    render: function () {
        return (
            <div className="page ProfilePage">
                <div className="weui_cells weui_cells_form">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FF70FA",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-zhanghao"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">昵称</div>
                        <div>
                            <input ref="profileVal" className="weui_input" type="text" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#DCFF71",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-xingbie"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">性别</div>
                        <div style={{marginLeft:"5rem"}}>
                            <label className="weui_check_label">男
                                <input ref="boy" type="radio" name="radio" value="男" id="radio1" style={{margin:"0 10px"}}/>
                            </label>
                            <label className="weui_check_label">女
                                <input ref="girl" type="radio" name="radio" value="女" id="radio2" style={{margin:"0 10px"}}/>
                            </label>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#81FFC4",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-xingming"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">姓名</div>
                        <div>
                            <input ref="nameVal" className="weui_input" type="text" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FFE96E",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-dianhua"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">电话</div>
                        <div>
                            <input ref="phoneVal" className="weui_input" type="number" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                </div>
                <div className="weui_btn_area">
                    <a className="weui_btn weui_btn_primary" href="javascript:;" onClick={this.handleSubmit}>保存</a>
                </div>
                <ToastError ref="ToastError" toast={this.state.toast}/>
                <ToastSuccess ref="ToastSuccess" toast={this.state.toast}/>
            </div>
        )
    }
});

module.exports = Profile;