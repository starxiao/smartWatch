/**
 * Created by user on 2016/9/14.
 */

import React from 'react';
import CreateXHR from './xhr';
import Cookie from './cookie';
import {hashHistory} from 'react-router';
import DialogCancel from './dialogCancel';
import ToastSuccess from './ToastSuccess';

import 'weui';
import '../styles/home.css';


var url = 'http://api.smartlocate.cn/v1/',
    username = Cookie("username"),
    ticket = Cookie("ticket");
var DeviceChange = React.createClass({
    getInitialState: function () {
        return {
            title: null,
            toast: null,
            dataList: []
        }
    },

    componentWillMount: function () {
        var that = this;
        CreateXHR({
            type: "GET",
            url: url + "device?username=" + username + "&ticket=" + ticket,
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({dataList: data.data});
                        break;
                    default:
                        hashHistory.push('/user/login');
                        break;
                }
            },
            complete:function () {
                that.deviceList();
            },
        })
    },

    handleClick: function () {
        var that = this,
            node = document.getElementsByClassName("DeleteCell"),
            dialog = that.refs.dialogCancel,
            toast = that.refs.toastSuccess;

        for(var i = 0; i < node.length; i++) {    // 闭包循环添加监听函数
            node[i].addEventListener('click',(function(i){
                return function () {

                    var ele = document.getElementsByClassName("IMEI"),
                        str = ele[i].innerText;
                    var IMEI = str.substring(str.indexOf('(') + 1, str.length - 1).trim();
                    that.setState({title: "确定要切换到该设备?"});
                    that.setState({toast: "切换成功"});
                    dialog.show(function () {

                        CreateXHR({
                            url: url + "user/"+username,
                            type:"put",
                            data:{
                                ticket:ticket,
                                masterIMEI:IMEI
                            },
                            success:function (data) {
                                switch (data.errcode) {
                                    case 0:
                                        Cookie("IMEI",IMEI);
                                        for (var i=0; i< ele.length; i++){
                                            ele[i].parentElement.style.backgroundColor = "white";
                                            if (ele[i].innerText.indexOf(IMEI) > 0){
                                                ele[i].parentElement.style.backgroundColor = "green";
                                            }
                                        }
                                        that.setState({toast: "切换成功"});
                                        toast.show();
                                        window.setTimeout(function () {
                                            toast.hide();
                                        }, 2000);
                                        break;
                                    default:
                                        hashHistory.push('/user/login');
                                        break;
                                }
                            },
                        });
                    });
                };
            })(i));
        }
    },

    deviceList: function () {
        var IMEI = Cookie("IMEI");
        var node = document.getElementsByClassName("IMEI");
        for (var i=0; i< node.length; i++){
            if (node[i].innerText.indexOf(IMEI) > 0){
                node[i].parentElement.style.backgroundColor = "green";
            }
        }
        this.handleClick();
    },

    handleMsg: function () {

        return this.state.dataList.map(function (data, index) {
            return (
                <div className="DeleteCell weui_cells weui_cells_access" style={{marginTop: '0px'}} key={index}>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{color:"#48E28B",width: "20px", marginRight: "10px", marginTop: "3px"}}>
                                <use xlinkHref="#icon-shoubiao"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>当前</p>
                        </div>
                        <div className="IMEI weui_cell_footer">
                            {data.nick + '(' + data.IMEI + ')'}
                        </div>
                    </div>
                </div>
            )
        })
    },
    render: function () {
        return (
            <div className="page">
                <div className="content">{this.handleMsg()}</div>
                <div className="footer">
                    <ul>
                        <li style={{backgroundColor: "#34AAB7"}}>
                            <a href="#">
                                <svg className="iconfont" aria-hidden="true">
                                    <use xlinkHref="#icon-iconfont13"/>
                                </svg>主页
                            </a>
                        </li>
                        <li style={{backgroundColor: "#54CC76"}}>
                            <a href="build.html#/device">
                                <svg className="iconfont" aria-hidden="true">
                                    <use xlinkHref="#icon-yonghu1"/>
                                </svg>我的
                            </a>
                        </li>
                    </ul>
                </div>
                <DialogCancel ref="dialogCancel" title={this.state.title}/>
                <ToastSuccess ref="toastSuccess" toast={this.state.toast}/>
            </div>
        )
    }

});

// export default DeviceChange;

module.exports = DeviceChange;