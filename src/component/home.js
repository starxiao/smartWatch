import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';

import DialogCancel from './dialogCancel';
import 'weui';
// import '../styles/guiqing.css';
// import '../image/iconfont/iconfont.css';

var Home = React.createClass({
    getInitialState: function () {
        return {
            IMEI: "",phone: "请先登录！", nick: "点击设置用户昵称", electricity:0, errMsg: "",
            dialogNode: null,
            dialogTitle: null
        }
    },


    componentWillMount: function () {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        if (!(username && ticket)) {
            var url = encodeURIComponent("http://app.smartlocate.cn/build/build.html#/login");
            window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?" +
                "redirectUri=" + url;
        } else {
                CreateXHR({
                    type: "GET",
                    url: "http://api.smartlocate.cn/v1/user/"+username+"?ticket=" + ticket,
                    success: function (data) {
                        switch (data.errcode) {
                            case 0:
                                data.data.nick ? that.setState({nick:data.data.nick}) : that.setState({nick:"点击设置用户昵称"});
                                break;
                            case 40001:
                                console.log("is error");
                                var url = encodeURIComponent("http://app.smartlocate.cn/build/build.html#/login");
                                window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?" +
                                    "redirectUri=" + url;
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
                CreateXHR({
                    type: "GET",
                    url: "http://api.smartlocate.cn/v1/device/?username="+username+"&ticket=" + ticket,
                    success: function (data) {
                        console.log(data);
                        switch (data.errcode) {
                            case 0:
                                if (data.data === null) {
                                    that.setState({IMEI: '你暂时没有绑定设备'});
                                    hashHistory.push("/deviceAdd");
                                } else {
                                    that.setState({IMEI: data.data[0].IMEI});
                                    Cookie("IMEI", data.data[0].IMEI);
                                }
                                break;
                            case 40001:
                                console.log("is error");
                                var url = encodeURIComponent("http://app.smartlocate.cn/build/build.html#/login");
                                window.location.href = "http://api.smartlocate.cn/v1/wechat/authorize?" +
                                    "redirectUri=" + url;
                                break;
                            case 44001:
                                hashHistory.push('/login');
                                break;
                            default:
                                break;
                        }
                    },
                    complete: function () {
                        that.handleEvent();
                    },
                    error: function (xhr) {
                        console.log(xhr.status + xhr.statusText);
                    }

                });
        }
    },

    handleNick:function () {
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
        that.setState({dialogTitle:'设置昵称'});
        that.setState({dialogNode:child});
        dialog.show(function () {
            var str = document.getElementsByClassName("nick")[0].value.trim();
            console.log(str);

            CreateXHR({
                url:"http://api.smartlocate.cn/v1/user/"+username,
                type:"put",
                data:{
                    ticket:ticket,
                    nick:str

                },
                success:function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.setState({nick:str});
                            break;
                        case 44001:
                            hashHistory.push('/login');
                            break;
                        default:
                            break;
                    }
                },
                error:function (xhr) {
                    console.log((xhr.status + xhr.statusText));
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
                url: "http://api.smartlocate.cn/v1/device/" + IMEI + "?username=" + username + "&ticket=" + ticket,
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.setState({
                                IMEI: data.data.IMEI,
                                electricity:data.data.electricity,
                                phone: username
                            });
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
        }

    },
    handlePhone: function () {
        var that = this;
        var dialog = that.refs.dialogCancel,
            title = "打电话",
            child =
                <div className="weui_cells weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">打电话</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="telephone weui_input" type="number" pattern="[0-9]*"
                                   placeholder="请输入手机号码"/>
                        </div>
                    </div>
                </div>;
        that.setState({dialogTitle: title});
        that.setState({dialogNode: child},function () {
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

        that.setState({dialogTitle: "监控"});
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
                url: "http://api.smartlocate.cn/v1/device/" + IMEI + "/action/monitor",
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
                        case 44001:
                            hashHistory.push('/login');
                            break;
                        default:
                            break;
                    }
                },
                error: function (xhr) {
                    console.error(xhr.status + xhr.statusText);
                }
            });
        });


    },
    render: function () {
        var time = new Date();
        var mymonth = time.getMonth() + 1, mydate = time.getDate(), myhour = time.getHours(), myminute = time.getMinutes();
        var time_str = mymonth + "月" + mydate + "日" + myhour + "时" + myminute + "分";
        return (
            <div className="container">
                <div className="ajax_head">
                    <div className="ajax_head_img">
                        <img src="../app/src/image/1.jpg" alt="头像"/>
                        <p onClick={this.handleNick}>{this.state.nick}</p>
                        <p className="head_p">绑定的设备: {this.state.IMEI}<span> ( 电量 {this.state.electricity}
                            )</span></p>
                    </div>
                    <div className="ajax_head_address" style={{clear: 'both'}}>
                        <p>绑定设备的手机号: {this.state.phone}</p>
                        <p>{time_str} <span> 综合定位</span></p>
                    </div>
                </div>
                <div className="content_container">
                    <div className="left">
                        <ul>
                            <li><a href="wechat.html" style={{backgroundColor: "#324CE6"}}><i
                                className="iconfont">&#xe672;</i>微聊</a>
                            </li>
                            <li><a href="javascript:(void 0);" style={{backgroundColor: "#1E39D6"}}
                                   onClick={this.handlePhone}><i className="iconfont">&#xe626;</i>打电话</a>
                            </li>
                            <li><a href="location.html#/locus" style={{backgroundColor: "#0C219A"}}><i
                                className="iconfont">&#xe638;</i>足迹</a>
                            </li>
                            <li><a href="location.html#/rail" style={{backgroundColor: "#09155A"}}><i
                                className="iconfont">&#xe635;</i>安全区域</a>
                            </li>
                        </ul>
                    </div>
                    <div className="right">
                        <ul>
                            <li><a href="location.html" className="aright_1"><i className="iconfont">&#xe609;</i><p>
                                地图</p></a>
                            </li>
                            <li><a href="build.html#/device" style={{backgroundColor: "#E68D3D"}}><i
                                className="iconfont">&#xe61a;</i>设置</a>
                            </li>
                            <li><a href="#" style={{backgroundColor: "#E84C6A"}} onClick={this.handleControl}><i
                                className="iconfont">&#xe67f;</i>监控</a>
                            </li>
                        </ul>
                    </div>
                    <div className="all">
                        <ul>
                            <li style={{marginRight: "5px"}}><a href="#" style={{backgroundColor: "#34C36D"}}><i
                                className="iconfont">&#xe626;</i>信息中心</a></li>
                            <li style={{marginRight: "5px"}}><a href="build.html#/alarm" style={{backgroundColor: "#15E267"}}><i
                                className="iconfont">&#xe626;</i>手表闹钟</a></li>
                            <li><a href="build.html#/find" style={{backgroundColor: "#CAD622"}}><i
                                className="iconfont">&#xe626;</i>找手表</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer">
                    <ul>
                        <li><a href="build.html#/setting" style={{backgroundColor: "#34AAB7"}}><i
                            className="iconfont" style={{fontSize: "16px"}}>&#xe6f4;</i><p>
                            关于我</p></a></li>
                        <li><a href="#" style={{backgroundColor: "#54CC76"}}><i className="iconfont"
                                                                                style={{fontSize: "16px"}}>&#x3478;</i>
                            <p>主页</p></a></li>
                    </ul>
                </div>
                <DialogCancel ref="dialogCancel" node={this.state.dialogNode} title={this.state.dialogTitle}/>
            </div>
        )
    }
});

export default Home;


