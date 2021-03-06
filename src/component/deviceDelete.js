/**
 * Created by user on 2016/9/9.
 */

import React from 'react';
import CreateXHR from './xhr';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import DialogCancel from './dialogCancel';
import ToastSuccess from './ToastSuccess';
import 'weui';
import '../styles/home.css';


var url = 'http://api.smartlocate.cn/v1/',
    username = Cookie('username'),
    ticket = Cookie('ticket');

var DeviceDelete = React.createClass({
    getInitialState: function () {
        return {
            title: null,
            toast: null,
            dataList: []
        }
    },

    componentWillMount: function () {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket");
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
            locaIMEI = Cookie("IMEI"),
            node = document.getElementsByClassName("DeleteCell"),
            dialog = that.refs.dialogCancel,
            toast = that.refs.toastSuccess;

        for (var i = 0; i < node.length; i++) {

            node[i].addEventListener('click', (function (i) {
                return function () {
                    var str = document.getElementsByClassName("IMEI")[i].innerText;
                    var IMEI = str.substring(str.indexOf('(') + 1, str.length - 1).trim();
                    if (locaIMEI === IMEI) {
                        that.setState({title: "不能删除正在使用的设备"});
                        dialog.show(function () {
                            return null;
                        });
                        return null;
                    }
                    that.setState({title: "确定要解除绑定?"});
                    dialog.show(function () {
                        CreateXHR({
                            type: "DELETE",
                            url: url + "device/" + IMEI + "?username=" + username + "&ticket=" +
                            ticket,
                            success: function (data) {
                                switch (data.errcode) {
                                    case 0:
                                        that.setState({toast: "删除成功"});
                                        toast.show();
                                        window.setTimeout(function () {
                                            toast.hide();
                                        }, 2000);
                                        that.componentWillMount();
                                        break;
                                    default:
                                        hashHistory.push('/user/login');
                                        break;
                                }
                            },
                        });
                    });
                }
            })(i));

        }
    },


    deviceList: function () {
        var IMEI = Cookie("IMEI");
        var node = document.getElementsByClassName("IMEI");
        for (var i=0; i< node.length; i++){
            if (node[i].innerText.indexOf(IMEI) > 0){
                node[i].parentElement.style.backgroundColor = "red";
            }
        }
        this.handleClick();
    },

    handleMsg: function () {
        var that = this;
        return that.state.dataList.map(function (data, index) {
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

// export default DeviceDelete;

module.exports = DeviceDelete;