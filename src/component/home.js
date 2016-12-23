/**
 * Created by xxx on 2016/11/23.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import ToastError from './ToastError';
import DialogCancel from './dialogCancel';
import 'weui';
import '../styles/home.css';

var url = 'http://api.smartlocate.cn/v1/';

var MyHome = React.createClass({

    getInitialState(){
        return {
            nick: '点击设置用户昵称',
            IMEI: '',
            phone: '请先登录',
            electricity: 100,
            date: '2016-01-01',
            type:'LBS',
            dialogNode: null,
            dialogTitle: null,
        }
    },
    componentWillMount: function () {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        if (!(username && ticket)) {
            var myUrl = encodeURIComponent("http://app.smartlocate.cn/build/build.html#/user/login");
            window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?" +
                "redirectUri=" + myUrl;
        } else {
            CreateXHR({
                type: "GET",
                url: url + "user/" + username + "?ticket=" + ticket,
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            data.data.nick ? that.setState({nick: data.data.nick}) : that.setState({nick: "点击设置用户昵称"});
                            break;
                        case 40001:
                            var myUrl = encodeURIComponent("http://app.smartlocate.cn/build/build.html#/user/login");
                            window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?" +
                                "redirectUri=" + myUrl;
                            break;
                        default:
                            hashHistory.push('/user/login');
                            break;
                    }
                },
                error: function () {
                    that.refs.toastError.show();
                    setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 2000);
                }
            });
            CreateXHR({
                type: "GET",
                url: url + "device/?username=" + username + "&ticket=" + ticket,
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            if (data.data === null) {
                                that.setState({IMEI: '你暂时没有绑定设备'});
                                hashHistory.push("/device/add");
                            } else {
                                var locationData = JSON.parse(data.data[0].location);
                                that.setState({
                                    IMEI: data.data[0].IMEI,
                                    date:locationData.created_at,
                                    type:locationData.type,
                                });
                                Cookie("IMEI", data.data[0].IMEI);
                            }
                            break;
                        case 40001:
                            var myUrl = encodeURIComponent("http://app.smartlocate.cn/build/build.html#/login");
                            window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?" +
                                "redirectUri=" + myUrl;
                            break;
                        default:
                            hashHistory.push('/user/login');
                            break;
                    }
                },
                complete: function () {
                    that.handleEvent();
                },
                error: function () {
                    that.refs.toastError.show();
                    setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 2000);
                }
            });
        }
    },

    handleNick: function () {
        var child =
                <div className="weui_cells weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">用户昵称</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="nick weui_input" placeholder="请输入昵称"/>
                        </div>
                    </div>
                </div>,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            that = this,
            dialog = that.refs.dialogCancel;
        that.setState({dialogTitle: '设置昵称'});
        that.setState({dialogNode: child});
        dialog.show(function () {
            var str = document.getElementsByClassName("nick")[1].value.trim();
            CreateXHR({
                url: url + "user/" + username,
                type: "put",
                data: {
                    ticket: ticket,
                    nick: str

                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.setState({nick: str});
                            break;
                        default:
                            hashHistory.push('/user/login');
                            break;
                    }
                },
                error: function () {
                    that.refs.toastError.show();
                    setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 2000);
                }
            });

        });


    },
    handleEvent: function () {
        var that = this,
            IMEI = Cookie("IMEI"),
            username = Cookie("username"),
            ticket = Cookie("ticket");
        if (IMEI) {
            CreateXHR({
                type: "GET",
                url: url + "device/" + IMEI + "?username=" + username + "&ticket=" + ticket,
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.setState({
                                IMEI: data.data.IMEI,
                                electricity: data.data.electricity,
                                phone: username
                            });
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
                            break;
                        default:
                            break;
                    }
                },
                error: function () {
                    that.refs.toastError.show();
                    setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 2000);
                }
            });
        }

    },
    handlePhone: function () {
        var that = this;
        var dialog = that.refs.dialogCancel,
            title = "呼叫",
            child =
                <div className="weui_cells weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="telephone weui_input" type="number" pattern="[0-9]*"
                                   placeholder="请输入手机号码"/>
                        </div>
                    </div>
                </div>;
        that.setState({dialogTitle: title});
        that.setState({dialogNode: child}, function () {
            document.getElementsByClassName("telephone")[0].value = '';
        });
        dialog.show(function () {
            var telephone = document.getElementsByClassName("telephone")[0].value.trim();
            window.location.href = "tel:" + telephone;
        });
    },

    handleControl: function () {
        var child =
                <div className="weui_cells weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="number weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                </div>,
            that = this,
            dialog = that.refs.dialogCancel;

        that.setState({dialogTitle: "监听"});
        that.setState({dialogNode: child}, function () {
            document.getElementsByClassName("number")[0].value = '';
        });


        dialog.show(function () {

            var ele = document.getElementsByClassName("number"),
                str = ele[0].value.trim(),
                username = Cookie("username"),
                ticket = Cookie("ticket"),
                IMEI = Cookie("IMEI");
            CreateXHR({
                url: url + "device/" + IMEI + "/action/monitor",
                type: "post",
                data: {
                    username: username,
                    ticket: ticket,
                    telephone: str
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            break;
                        default:
                            hashHistory.push('/user/login');
                            break;
                    }
                },
                error: function () {
                    that.refs.toastError.show();
                    setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 2000);
                }
            });
        });
    },

    render: function () {
        var time = new Date();
        var month = time.getMonth() + 1, date = time.getDate(), hour = time.getHours(), minute = time.getMinutes();
        var nowTime = month + "月" + date + "日" + hour + "时" + minute + "分";
        return (
            <div className="homePage page">
                <div className="header">
                    <div className="headerImage">
                        <img src="../app/src/image/headImage.jpg" alt="头像"/>
                        <p className="nick" onClick={this.handleNick}>{this.state.nick}</p>
                    </div>
                    <div className="headerMsg">
                        <p className="head_p">绑定的设备: {this.state.IMEI}
                            <strong style={{color:"#DA3F57"}}> (电量 {this.state.electricity})</strong>
                        </p>
                        <p>绑定设备的手机号: <strong style={{color:"#DAA520"}}>{this.state.phone}</strong></p>
                        <p>{this.state.date}<strong style={{color:"#E24DDB"}}>  定位类型: {this.state.type} </strong></p>
                    </div>
                </div>
                <div className="content">
                    <div className="top">
                        <div className="left">
                            <ul>
                                <li style={{backgroundColor: "#324CE6"}}>
                                    <a href="build.html#/user/chat">
                                        <svg className="iconfont" aria-hidden="true">
                                            <use xlinkHref="#icon-mic"/>
                                        </svg>微聊
                                    </a>
                                </li>
                                <li style={{backgroundColor: "#1E39D6"}}>
                                    <a href="javascript:void(0);" onClick={this.handlePhone}>
                                        <svg className="iconfont" aria-hidden="true">
                                            <use xlinkHref="#icon-dadianhua"/>
                                        </svg>呼叫
                                    </a>
                                </li>
                                <li style={{backgroundColor: "#0C219A"}}>
                                    <a href="build.html#/device/locus">
                                        <svg className="iconfont" aria-hidden="true">
                                            <use xlinkHref="#icon-zuji"/>
                                        </svg>足迹
                                    </a>
                                </li>
                                <li style={{backgroundColor: "#09155A"}}>
                                    <a href="build.html#/device/rail">
                                        <svg className="iconfont" aria-hidden="true">
                                            <use xlinkHref="#icon-dianziweilan"/>
                                        </svg>安全区域
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="right">
                            <ul>
                                <li style={{height:"6rem",padding:"15px 0",backgroundColor:"#671ED6"}}>
                                    <a style={{lineHeight:"6rem"}} href="build.html#/device/locate" className="aright_1">
                                        <svg className="iconfont" aria-hidden="true">
                                            <use xlinkHref="#icon-dingwei"/>
                                        </svg>地图
                                    </a>
                                </li>
                                <li style={{backgroundColor: "#E68D3D"}}>
                                    <a href="build.html#/device/setting">
                                        <svg className="iconfont" aria-hidden="true">
                                            <use xlinkHref="#icon-shezhi"/>
                                        </svg>设置
                                    </a>
                                </li>
                                <li style={{backgroundColor: "#E84C6A"}}>
                                    <a href="javascript:void(0);" onClick={this.handleControl}>
                                        <svg className="iconfont" aria-hidden="true">
                                            <use xlinkHref="#icon-view"/>
                                        </svg>监听
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="bottom">
                        <ul>
                            <li style={{backgroundColor: "#34C36D"}}>
                                <a href="#">
                                    <svg className="iconfont" aria-hidden="true">
                                        <use xlinkHref="#icon-xiaoxizhongxin"/>
                                    </svg>信息中心
                                </a>
                            </li>
                            <li style={{backgroundColor: "#15E267"}}>
                                <a href="build.html#/device/alarm">
                                    <svg className="iconfont" aria-hidden="true">
                                        <use xlinkHref="#icon-icon"/>
                                    </svg>手表闹钟
                                </a>
                            </li>
                            <li style={{backgroundColor: "#CAD622"}}>
                                <a href="build.html#/user/find">
                                    <svg className="iconfont" aria-hidden="true">
                                        <use xlinkHref="#icon-shoubiao"/>
                                    </svg>找手表
                                </a>
                            </li>
                        </ul>
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
                            <a href="build.html#/device">
                                <svg className="iconfont" aria-hidden="true">
                                    <use xlinkHref="#icon-yonghu1"/>
                                </svg>我的
                            </a>
                        </li>
                    </ul>
                </div>
                <DialogCancel ref="dialogCancel" node={this.state.dialogNode} title={this.state.dialogTitle}/>
                <ToastError ref="toastError" toast="网络错误"/>
            </div>
        )
    }
});

module.exports = MyHome;
// export default MyHome;