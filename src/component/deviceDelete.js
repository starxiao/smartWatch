/**
 * Created by user on 2016/9/9.
 */

import React from 'react';
import CreateXHR from './xhr';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import DialogCancel from './dialogCancel';
import ToastSuccess from './ToastSuccess';



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
            url: "http://api.smartlocate.cn/v1/device?username=" + username + "&ticket=" + ticket,
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({dataList: data.data});
                        break;
                    case 44001:
                        hashHistory.push('/login');
                        break;
                    default:
                        break;
                }
            },
            complete:function () {
                that.deviceList();
            },
            error: function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }

        })
    },

    handleClick: function () {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
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
                            url: "http://api.smartlocate.cn/v1/device/" + IMEI + "?username=" + username + "&ticket=" +
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
                                    case 44001:
                                        hashHistory.push('/login');
                                        break;
                                    default:
                                        break;
                                }
                            },
                            error: function (xhr) {
                                console.log(xhr.status + xhr.statusText);
                            }
                        });
                    });
                }
            })(i));

        }
    },


    deviceList: function () {
        var IMEI = Cookie("IMEI");
        var node = document.getElementsByClassName("IMEI");
        //console.log(node[0].parentNode);
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
                            <i className="iconfont" style={{color:"#48E28B",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe64b;</i>
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
                            <a href="build.html#/setting">
                                <i className="iconfont">&#xe6f4;</i>关于我
                            </a>
                        </li>
                        <li style={{backgroundColor: "#54CC76"}}>
                            <a href="#">
                                <i className="iconfont">&#x3478;</i>主页
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

export default DeviceDelete;