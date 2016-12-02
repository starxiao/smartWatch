/**
 * Created by user on 2016/11/24.
 */

import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import RongYun from './RongYun';
import Send from './send.js';
import ToastLoad from './ToastLoad';
import ToastError from './ToastError';

import 'weui';
import '../styles/chat.css';
import '../styles/iconfont.css';


var Chat = React.createClass({
    getInitialState: function () {
        return {
            content: '手指上滑,取消发送',
            flag: true,
            url: 'http://api.smartlocate.cn/v1/',
            key: 0,
            startTime: 0,
            num: 0,
            node: null,
            message: [],
        }
    },
    componentWillMount: function () {
        console.log('this is willMount');
        var that = this,
            username = Cookie('username'),
            ticket = Cookie('ticket'),
            IMEI = Cookie('IMEI');
        CreateXHR({
            type: 'GET',
            url: that.state.url + 'device/' + IMEI + '/chatRecord?username=' +
            username + '&ticket=' + ticket + '&orderType=timeDesc&startId=0&length=10',
            success: function (res) {
                switch (res.errcode) {
                    case 0:
                        console.log(res.data);
                        var msg = [];
                        for (var i = res.data.length - 1; i >= 0; i--) {
                            if (res.data[i].direction === 2) {
                                if (res.data[i].type === 'text') {
                                    let ele = function () {
                                        return (
                                            <div className="message" key={i}>
                                                <p className="date">{res.data[i].created_at}</p>
                                                <div className="bottom">
                                                    <p style={{marginLeft: "5rem"}}>{res.data[i].content}</p>
                                                    <div className="bot"></div>
                                                    <img src="../app/src/image/headImage.jpg"/>
                                                </div>
                                            </div>
                                        )
                                    }();
                                    msg.push(ele);
                                } else {
                                    let ele = function () {
                                        return (
                                            <div className="message" key={i}>
                                                <p className="date">{res.data[i].created_at}</p>
                                                <div className="bottom">
                                                    <div style={{
                                                        fontSize: "1rem",
                                                        margin: "15px 10px 0 0",
                                                        color: "grey"
                                                    }}>{res.data[i].duration + '"'}</div>
                                                    <p onClick={that.playVoice}>
                                                        <audio src={res.data[i].voiceUrl}></audio>
                                                        <li>
                                                            <i className="iconfont icon-voice-1"></i>
                                                            <i className="iconfont icon-voice-2"></i>
                                                            <i className="iconfont icon-voice-3"></i>
                                                        </li>
                                                    </p>
                                                    <div className="bot"></div>
                                                    <img src="../app/src/image/headImage.jpg"/>
                                                </div>
                                            </div>
                                        )
                                    }();
                                    msg.push(ele);
                                }
                            } else {
                                let ele = function () {
                                    return (
                                        <div className="message" key={i}>
                                            <p className="date">{res.data[i].created_at}</p>
                                            <div className="bottom deviceBottom">
                                                <div style={{
                                                    fontSize: "1rem",
                                                    margin: "15px 0 0 10px",
                                                    color: "grey"
                                                }}>{res.data[i].duration + '"'}</div>
                                                <p onClick={that.playVoice}>
                                                    <audio src={res.data[i].voiceUrl}></audio>
                                                    <i className="iconfont icon-voice-1"></i>
                                                    <i className="iconfont icon-voice-2"></i>
                                                    <i className="iconfont icon-voice-3"></i>
                                                </p>
                                                <div className="bot"></div>
                                                <img src="../app/src/image/headImage.jpg"/>
                                            </div>
                                        </div>
                                    )
                                }();
                                msg.push(ele);
                            }
                        }
                        that.setState({message: msg}, function () {
                            window.scrollTo(0, 10000);
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
                hashHistory.push('/login');
            },
        });
    },
    componentDidMount: function () {
        console.log(window.location.href);
        CreateXHR({
            type: "GET",
            url: this.state.url + "/system?pageUrl=" + encodeURIComponent(window.location.href),
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

                                // 所有要调用的 API 都要加到这个列表中
                                "startRecord",
                                "stopRecord",
                                "onVoiceRecordEnd",
                                "playVoice",
                                "pauseVoice",
                                "stopVoice",
                                "uploadVoice",
                                "downloadVoice",
                                "translateVoice",
                            ]
                        });
                        wx.error(function (res) {
                            console.log(res);
                            hashHistory.push('/login');
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
                hashHistory.push('/login');
            }
        });
        RongYun(this.RongYunVoice);

    },
    RongYunVoice: function (message) {
        var that = this;
        if (message.content.content === "MessageReceived") {
            console.log(message);
            console.log(message.content.extra);
            var ele = function () {
                return (
                    <div className="message" key={'user' + that.state.key}>
                        <p className="date">{message.content.extra.created_at}</p>
                        <div className="bottom deviceBottom">
                            <div style={{
                                fontSize: "1rem",
                                margin: "15px 0 0 10px",
                                color: "grey"
                            }}>{message.content.extra.duration + '"'}</div>
                            <p onClick={that.playVoice}>
                                <audio src={message.content.extra.mp3Url}></audio>
                                <i className="iconfont icon-voice-1"></i>
                                <i className="iconfont icon-voice-2"></i>
                                <i className="iconfont icon-voice-3"></i>
                            </p>
                            <div className="bot"></div>
                            <img src="../app/src/image/headImage.jpg"/>
                        </div>
                    </div>
                )
            }();
            var msg = that.state.message;
            msg.push(ele);
            that.setState({message: msg, key: that.state.key + 1}, function () {
                window.scrollTo(0, 10000);
            });
        }
    },
    toggleText: function () {
        this.refs.btn.style.display = "none";
        this.refs.text.style.display = "flex";
    },
    toggleVoice: function () {
        this.refs.btn.style.display = "flex";
        this.refs.text.style.display = "none";
    },
    chatRecord: function (res) {              //sendRecord
        var that = this,
            IMEI = Cookie('IMEI'),
            username = Cookie('username'),
            ticket = Cookie('ticket');

        wx.uploadVoice({
            localId: res.localId,            // 需要上传的音频的本地ID，由stopRecord接口获得
            success: function (res) {
                console.log('success');
                console.log(res);              // 返回音频的服务器端ID serverId
                CreateXHR({
                    type: "POST",
                    url: that.state.url + "device/" + IMEI + "/voice",
                    data: {
                        username: username,
                        ticket: ticket,
                        wechatMediaId: res.serverId
                    },
                    success: function (data) {
                        switch (data.errcode) {
                            case 0:
                                console.log(data);
                                var Obj = new Date(), hour = Obj.getHours(), minute = Obj.getMinutes(),
                                    date = hour + ':' + minute;
                                var ele = function () {
                                    return (
                                        <div className="message" key={'user' + that.state.key}>
                                            <p className="date" style={{width: "2.9rem"}}>{date}</p>
                                            <div className="bottom">
                                                <div style={{
                                                    fontSize: "1rem",
                                                    margin: "15px 10px 0 0",
                                                    color: "grey"
                                                }}>{data.data.duration + '"'}</div>
                                                <p onClick={that.playVoice}>
                                                    <audio src={data.data.voiceUrl}></audio>
                                                    <li>
                                                        <i className="iconfont icon-voice-1"></i>
                                                        <i className="iconfont icon-voice-2"></i>
                                                        <i className="iconfont icon-voice-3"></i>
                                                    </li>
                                                </p>
                                                <div className="bot"></div>
                                                <img src="../app/src/image/headImage.jpg"/>
                                            </div>
                                        </div>
                                    )
                                }();
                                var msg = that.state.message;
                                msg.push(ele);
                                that.setState({message: msg, key: that.state.key + 1}, function () {
                                    window.scrollTo(0, 10000);
                                });
                                break;
                            case 44001:
                                hashHistory.push('/login');
                                break;
                            default:
                                hashHistory.push('/login');
                                break;
                        }
                    },
                    error: function (xhr) {
                        console.log(xhr.status + xhr.statusText);
                        hashHistory.push('/login');
                    }
                });
            },
            fail: function (res) {
                console.log('fail');
                console.log(res);
            }
        });

    },
    sendText: function () {
        var that = this,
            IMEI = Cookie("IMEI"),
            username = Cookie("username"),
            ticket = Cookie("ticket");
        var val = that.refs.content.value;
        that.refs.content.value = '';
        var Obj = new Date(), hour = Obj.getHours() < 10 ? '0'+Obj.getHours():Obj.getHours() ,
            minute = Obj.getMinutes()<10 ? '0' + Obj.getMinutes():Obj.getMinutes(),
            date = hour + ':' + minute;
        var ele = function () {
            return (
                <div className="message" key={'user' + that.state.key}>
                    <p className="date" style={{width: "2.9rem"}}>{date}</p>
                    <div className="bottom">
                        <p style={{marginLeft: "5rem"}}>{val}</p>
                        <div className="bot"></div>
                        <img src="../app/src/image/headImage.jpg"/>
                    </div>
                </div>
            )
        }();
        var msg = that.state.message;
        msg.push(ele);
        that.setState({message: msg, key: that.state.key + 1}, function () {
            window.scrollTo(0, 10000);
        });
        CreateXHR({
            type: "post",
            url: this.state.url + "device/" + IMEI + "/text",
            data: {
                username: username,
                ticket: ticket,
                content: val
            },
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        console.log(data);
                        break;
                    case 44001:
                        hashHistory.push('/login');
                        break;
                    default:
                        hashHistory.push('/login');
                        break;
                }
            },
            error: function (xhr) {
                console.log(xhr.status + xhr.statusText);
                hashHistory.push('/login');
            }
        });

    },

    touchStart: function (e) {


        console.log(e);
        e.preventDefault();
        console.log(e.touches);
        console.log(e.touches[0].pageY);
        var that = this;
        console.log('start');
        that.refs.record.style.backgroundColor = '#C8C8C8';
        that.refs.record.innerHTML = '松开 结束';
        wx.startRecord();
        this.refs.toastLoad.show();
        var time = new Date().getTime();
        this.setState({startTime: time,num:e.touches[0].pageY});

        wx.onVoiceRecordEnd({                     // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: function (res) {
                that.chatRecord(res);
            }
        });
    },
    touchMove: function (e) {
        console.log(e.changedTouches);
        e.preventDefault();
        console.log('move');

        this.setState({num: this.state.num + 1});
        if ((this.state.num-e.changedTouches[0].pageY) > 20) {
            this.setState({content: "松开手指,取消发送", flag: false});
        }

    },
    touchCancel: function () {
        console.log('cancel');
    },
    touchEnd: function (e) {
        e.preventDefault();
        console.log(e);
        console.log(e.changedTouches);

        var that = this,
            IMEI = Cookie("IMEI"),
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            time = new Date().getTime();
        console.log('end');
        that.refs.record.style.backgroundColor = '#ffffff';
        that.refs.record.innerHTML = '按住 说话';
        if ((time - that.state.startTime) < 300) {
            that.refs.toastLoad.hide();
            that.refs.toastError.show();
            window.setTimeout(function () {
                that.refs.toastError.hide();
            }, 500)
        } else {

            this.refs.toastLoad.hide();
            console.log(this.state.flag);
            wx.stopRecord({
                success: function (res) {
                    console.log(res);           //返回本地ID res.localId

                    if (that.state.flag) {
                        that.chatRecord(res);
                    } else {
                        that.setState({content: "手指上滑,取消发送", flag: true, num: 0});
                    }
                },
                fail: function (res) {
                    console.log('fail' + res);
                }
            });
        }
    },
    playVoice: function (e) {
        var that = this;
        console.log('playVoice');

        console.log(e.target);         // 只关注点击的元素。
        console.log(e.currentTarget);  //返回绑定事件的元素
        var node = e.currentTarget;


        if (this.state.node !== null) {
            console.log('pause');
            this.state.node.firstElementChild.pause();
        }
        this.animate(node);
        node.firstElementChild.play();
        console.log('play');
        this.setState({node: node});

    },
    endVoice: function (e) {


        console.log(this.state.node);
        this.animate(this.state.node);
        this.state.node.firstElementChild.play();
        console.log('play');


    },
    animate: function (e) {


        console.log(e.children);

        var eleArr = e.children;
        var arr = [];
        for (var i = 0; i < eleArr.length; i++) {
            console.log(eleArr[i].tagName);
            if (eleArr[i].tagName === 'I') {
                arr.push(eleArr[i]);
            }
            if(eleArr[i].tagName === 'LI'){
                var node = eleArr[i].children;
                console.log(node);
                for(var j=0 ;j<node.length; j++){
                    arr.push(node[j]);
                }
            }
        }
        console.log(arr);

        for (var j = 0; j < arr.length; j++) {
            (function (index) {
                if (index === 0) {
                    window.setTimeout(function () {
                        arr[index + 2].style.display = 'none';
                        arr[index].style.display = 'block';
                        arr[index + 1].style.display = 'none';
                    },(index+1)*500);

                } else if (index === 1) {
                    window.setTimeout(function () {
                        arr[index - 1].style.display = 'none';
                        arr[index].style.display = 'block';
                        arr[index + 1].style.display = 'none';
                    },(index+1)*500);
                } else {
                    window.setTimeout(function () {
                        arr[index - 2].style.display = 'none';
                        arr[index - 1].style.display = 'none';
                        arr[index].style.display = 'block';
                    },(index+1)*500);
                }
            })(j);
        }

    },
    shouldComponentUpdate: function (nextState) {

        if (this.state.message !== nextState.message) {
            return true;
        } else {
            return false;
        }
    },
    render: function () {
        return (
            <div className="page chatPage">
                <div className="content" ref="scroll">
                    {this.state.message}
                </div>
                <footer>
                    <div className="btn" ref="btn">
                        <ul>
                            <li className="icon">
                                <img src='../app/src/image//record.png' onClick={this.toggleText}/>
                            </li>
                            <li ref="record" className="record" onTouchStart={this.touchStart}
                                onTouchMove={this.touchMove}
                                onTouchCancel={this.touchCancel} onTouchEnd={this.touchEnd}>
                                按住 录音
                            </li>
                        </ul>
                    </div>
                    <div className="text" ref="text">
                        <img src='../app/src/image//record.png' onClick={this.toggleVoice}/>
                        <input ref="content" type="text" placeholder="请输入想说的话"/>
                        <a href="javascript:void(0);" onClick={this.sendText}>发送</a>
                    </div>
                </footer>
                <ToastLoad ref="toastLoad" content={this.state.content}/>
                <ToastError ref="toastError" toast="说话时间太短"/>
            </div>
        )
    }


});

export default Chat
