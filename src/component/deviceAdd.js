/**
 * Created by user on 2016/9/9.
 */


import React from 'react';
import Cookie from './cookie';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import ToastSuccess from './ToastSuccess';
import ToastError from './ToastError';
import 'weui';
import '../styles/home.css';

var DeviceAdd = React.createClass({
    getInitialState: function () {
        return {
            url:'http://api.smartlocate.cn/v1/',
            content: '',
            toast: ''
        }
    },
    componentDidMount:function () {
        var that =this;
        var script = document.createElement('script');
        script.src = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function () {
            CreateXHR({
                type: "GET",
                url: that.state.url + "/system?pageUrl=" + encodeURIComponent(window.location.href),
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            console.log(data);
                            wx.config({
                                debug: false,
                                appId: data.data.appId,
                                timestamp: data.data.timestamp,
                                nonceStr: data.data.nonceStr,
                                signature: data.data.signature,
                                jsApiList: [
                                    'scanQRCode'
                                ]
                            });
                            wx.error(function () {
                                hashHistory.push('/user/login');
                            });
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
                            break;
                        default:
                            break;
                    }
                },
                error: function (xhr) {
                    console.log(xhr.status + xhr.statusText);
                    hashHistory.push('/user/login');
                }
            });
        };

    },
    handleClick: function () {
        var IMEI = this.refs.IMEI.value.trim(),
            nick = this.refs.nick.value.trim(),
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            that = this,
            flag = /[0-9]/;        //到时这里需要输入判断格式问题

        if (!(IMEI || nick || flag.test(IMEI))) {

            that.setState({content: "你输入的IMEI号错误"});
        } else {

            that.setState({content: ""});
        }
        CreateXHR({
            type: "POST",
            url: "http://api.smartlocate.cn/v1/device",
            data: {
                username: username,
                ticket: ticket,
                IMEI: IMEI,
                nick: nick
            },
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({toast: "绑定成功"});
                        that.refs.toastSuccess.show();
                        window.setTimeout(function () {
                            that.refs.toastSuccess.hide();
                        }, 2000);
                        break;
                    case 30001:
                        that.setState({toast: "该设备不存在"});
                        that.refs.toastError.show();
                        window.setTimeout(function () {
                            that.refs.toastError.hide();
                        }, 2000);
                        break;
                    case 30003:
                        that.setState({toast: "你已绑定该设备了"});
                        that.refs.toastError.show();
                        window.setTimeout(function () {
                            that.refs.toastError.hide();
                        }, 2000);
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        break;
                }
            },
            error: function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }
        });
    },
    handleCode:function () {
        var that  = this;
        console.log('code');
        wx.scanQRCode({
            needResult: 1,
            scanType: ["qrCode","barCode"],
            success: function (res) {
                that.refs.IMEI.value = res.resultStr;
            }
        });

    },
    render: function () {
        return (
            <div className="page deviceAddPage">
                <div className="content" style={{padding: "10px"}}>
                    <div className="weui_cells">
                        <div className="weui_cell" style={{borderRadius:"5px",border:"1px solid #04be02",padding:"20px"}}>
                            <div className="weui_cell_hd">
                                <label className="weui_label">设备号：</label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="number" pattern="[0-9]*" placeholder="输入IMEI号" ref="IMEI"/>
                            </div>
                            <div className="weui_cell_ft">
                                <img src="../app/src/image/code.png" onClick={this.handleCode}/>
                            </div>
                        </div>
                        <div className="weui_cell" style={{borderRadius:"5px",border:"1px solid #04be02",padding:"20px",marginTop:"10px"}}>
                            <div className="weui_cell_hd">
                                <label className="weui_label">设备昵称:</label>
                            </div>
                            <div className="weui_cell_bd weui_cell_primary">
                                <input className="weui_input" type="text" placeholder="请输入宝贝昵称" ref="nick"/>
                            </div>
                        </div>
                        <div className="weui_btn_area">
                            <a className="weui_btn weui_btn_primary" href="javascript:void(0);" onClick={this.handleClick}>
                                添加
                            </a>
                        </div>
                    </div>
                </div>
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
                            <a href="test.html#/device">
                                <svg className="iconfont" aria-hidden="true">
                                    <use xlinkHref="#icon-yonghu1"/>
                                </svg>我的
                            </a>
                        </li>
                    </ul>
                </div>
                <p style={{color:"red"}}>{this.state.content}</p>
                <ToastError  ref="toastError" toast={this.state.toast}/>
                <ToastSuccess  ref="toastSuccess" toast={this.state.toast}/>
            </div>
        )
    }
});


// export default DeviceAdd;

module.exports = DeviceAdd;