/**
 * Created by user on 2016/11/24.
 */

import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import RongYun from './RongYun';
import ToastLoad from './ToastLoad';
import ToastError from './ToastError';

import 'weui';
import '../styles/chat.css';

var url = 'http://api.smartlocate.cn/v1/',
    username = Cookie('username'),
    ticket = Cookie('ticket'),
    IMEI = Cookie('IMEI');

var Chat = React.createClass({
    getInitialState: function () {
        return {
            content: '手指上滑,取消发送',
            toast: '说话时间太短',
            flag: true,
            key: 0,
            startTime: 0,
            num: 0,
            node: null,
            message: [],
            timeout: null,
        }
    },
    componentWillMount: function () {
        var that = this;
        CreateXHR({
            type: 'GET',
            url: url + 'device/' + IMEI + '/chatRecord?username=' +
            username + '&ticket=' + ticket + '&orderType=timeDesc&startId=0&length=20',
            success: function (res) {
                switch (res.errcode) {
                    case 0:
                        console.log(res);
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
                                                    <div className="duration" style={{
                                                        fontSize: "1rem",
                                                        margin: "15px 10px 0 0",
                                                        color: "grey"
                                                    }}>{res.data[i].duration + '"'}</div>
                                                    <p onClick={that.playVoice}>
                                                        <audio src={res.data[i].voiceUrl}/>
                                                        <li>
                                                            <svg className="iconfont icon-voice-1" aria-hidden="true">
                                                                <use xlinkHref="#icon-voice-1"/>
                                                            </svg>
                                                            <svg className="iconfont icon-voice-2" aria-hidden="true">
                                                                <use xlinkHref="#icon-voice-2"/>
                                                            </svg>
                                                            <svg className="iconfont" aria-hidden="true">
                                                                <use xlinkHref="#icon-voice-3"/>
                                                            </svg>
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
                                var color = res.data[i].flag_read ? 'FFF': 'FF0000';
                                let ele = function () {
                                    return (
                                        <div className="message" key={i}>
                                            <p className="date">{res.data[i].created_at}</p>
                                            <div className="bottom deviceBottom">
                                                <div style={{
                                                    fontSize: "1rem",
                                                    margin: "15px 0 0 10px",
                                                    color: "grey"
                                                }}>
                                                    <div className="radius" style={{backgroundColor:{color}}}></div>
                                                    <div className="duration">{res.data[i].duration + '"'}</div>
                                                </div>
                                                <p onClick={that.playVoice}>
                                                    <audio src={res.data[i].voiceUrl}/>
                                                    <svg className="iconfont icon-voice-1" aria-hidden="true">
                                                        <use xlinkHref="#icon-voice-1"/>
                                                    </svg>
                                                    <svg className="iconfont icon-voice-2" aria-hidden="true">
                                                        <use xlinkHref="#icon-voice-2"/>
                                                    </svg>
                                                    <svg className="iconfont" aria-hidden="true">
                                                        <use xlinkHref="#icon-voice-3"/>
                                                    </svg>
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
                    default:
                        hashHistory.push('/user/login');
                        break;
                }
            },
            error: function () {
                that.setState({toast: '网络错误'});
                that.refs.toastError.show();
                window.setTimeout(function () {
                    that.refs.toastError.hide();
                }, 2000);

            },
        });
    },
    componentDidMount: function () {

        var that = this;

        var script = document.createElement('script');
        script.src = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function () {
            CreateXHR({
                type: "GET",
                url: url + "/system?pageUrl=" + encodeURIComponent(window.location.href),
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
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
                            wx.ready(function(){
                                if (!localStorage.getItem('allowRecord') || localStorage.getItem('allowRecord') !== 'true') {
                                    wx.startReocrd({
                                        success: function () {
                                            localStorage.setItem('allowRecord', 'true');
                                            wx.stopRecord();
                                        },
                                        fail: function () {
                                            that.setState({toast: '请允许录音'});
                                            that.refs.toastError.show();
                                            window.setTimeout(function () {
                                                that.refs.toastError.hide();
                                            }, 2000);
                                        }

                                    });
                                }
                            });
                            wx.error(function () {
                                that.setState({toast: '网络错误'});
                                that.refs.toastError.show();
                                window.setTimeout(function () {
                                    that.refs.toastError.hide();
                                }, 2000);
                                hashHistory.push('/user/login');
                            });
                            break;
                        default:
                            hashHistory.push('/user/login');
                            break;
                    }
                },
                error: function () {
                    that.setState({toast: '网络错误'});
                    that.refs.toastError.show();
                    window.setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 2000);
                }
            });

            script.src = 'http://cdn.ronghub.com/RongIMLib-2.2.1.min.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            script.onload = function () {
                RongYun(that.RongYunVoice);
            };
        };
    },
    RongYunVoice: function (message) {
        var that = this;
        if (message.content.content === "MessageReceived") {
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
                                <audio src={message.content.extra.mp3Url}/>
                                <svg className="iconfont icon-voice-1" aria-hidden="true">
                                    <use xlinkHref="#icon-voice-1"/>
                                </svg>
                                <svg className="iconfont icon-voice-2" aria-hidden="true">
                                    <use xlinkHref="#icon-voice-2"/>
                                </svg>
                                <svg className="iconfont icon-voice-3" aria-hidden="true">
                                    <use xlinkHref="#icon-voice-3"/>
                                </svg>
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
        var that = this;
        wx.uploadVoice({
            localId: res.localId,            // 需要上传的音频的本地ID，由stopRecord接口获得
            success: function (res) {
                // 返回音频的服务器端ID serverId
                CreateXHR({
                    type: "POST",
                    url: url + "device/" + IMEI + "/voice",
                    data: {
                        username: username,
                        ticket: ticket,
                        wechatMediaId: res.serverId
                    },
                    success: function (data) {
                        switch (data.errcode) {
                            case 0:
                                var Obj = new Date(),
                                    hour = Obj.getHours() < 10 ? '0' + Obj.getHours() : Obj.getHours(),
                                    minute = Obj.getMinutes() < 10 ? '0' + Obj.getMinutes() : Obj.getMinutes(),
                                    date = hour + ':' + minute;
                                var ele = function () {
                                    return (
                                        <div className="message" key={'user' + that.state.key}>
                                            <p className="date" style={{width: "3.4rem"}}>{date}</p>
                                            <div className="bottom">
                                                <div style={{
                                                    fontSize: "1rem",
                                                    margin: "15px 10px 0 0",
                                                    color: "grey"
                                                }}>{data.data.duration + '"'}</div>
                                                <p onClick={that.playVoice}>
                                                    <audio src={data.data.voiceUrl}/>
                                                    <li>
                                                        <svg className="iconfont icon-voice-1" aria-hidden="true">
                                                            <use xlinkHref="#icon-voice-1"/>
                                                        </svg>
                                                        <svg className="iconfont icon-voice-2" aria-hidden="true">
                                                            <use xlinkHref="#icon-voice-2"/>
                                                        </svg>
                                                        <svg className="iconfont" aria-hidden="true">
                                                            <use xlinkHref="#icon-voice-3"/>
                                                        </svg>
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
                            default:
                                hashHistory.push('/user/login');
                                break;
                        }
                    },
                    error: function () {
                        that.setState({toast: '网络错误'});
                        that.refs.toastError.show();
                        window.setTimeout(function () {
                            that.refs.toastError.hide();
                        }, 2000);
                    }
                });
            },
            fail: function () {
                that.setState({toast: '网络错误'});
                that.refs.toastError.show();
                window.setTimeout(function () {
                    that.refs.toastError.hide();
                }, 2000);
            }
        });

    },
    sendText: function () {
        var that = this,
            val = that.refs.content.value;
        that.refs.content.value = '';
        var Obj = new Date(), hour = Obj.getHours() < 10 ? '0' + Obj.getHours() : Obj.getHours(),
            minute = Obj.getMinutes() < 10 ? '0' + Obj.getMinutes() : Obj.getMinutes(),
            date = hour + ':' + minute;
        var ele = function () {
            return (
                <div className="message" key={'user' + that.state.key}>
                    <p className="date" style={{width: "3.4rem"}}>{date}</p>
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
            url: url + "device/" + IMEI + "/text",
            data: {
                username: username,
                ticket: ticket,
                content: val
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
                that.setState({toast: '网络错误'});
                that.refs.toastError.show();
                window.setTimeout(function () {
                    that.refs.toastError.hide();
                }, 2000);
            }
        });

    },

    touchStart: function (e) {
        wx.startRecord();
        e.preventDefault();
        var that = this;
        that.refs.record.style.backgroundColor = '#C8C8C8';
        that.refs.record.innerHTML = '松开 结束';

        that.refs.toastLoad.show();
        var timeout = window.setTimeout(function () {
            that.refs.toastLoad.hide();
            wx.stopRecord({
                success: function (res) {
                    that.chatRecord(res);  //返回本地ID res.localId
                },
                fail: function () {
                    that.setState({toast: '网络错误'});
                    that.refs.toastError.show();
                    window.setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 2000);
                }
            });
        }, 15500);
        var time = new Date().getTime();
        that.setState({startTime: time, num: e.touches[0].pageY, timeout: timeout});
    },
    touchMove: function (e) {
        e.preventDefault();
        this.setState({num: this.state.num + 1});
        if ((this.state.num - e.changedTouches[0].pageY) > 20) {
            window.clearTimeout(this.state.timeout);
            this.setState({content: "松开手指,取消发送", flag: false});
        }

    },
    touchEnd: function (e) {
        e.preventDefault();
        var that = this;
        var time = new Date().getTime();
        that.refs.toastLoad.hide();
        wx.stopRecord({
            success: function (res) {
                if ((time - that.state.startTime) < 500) {
                    that.refs.toastError.show();
                    window.setTimeout(function () {
                        that.refs.toastError.hide();
                    }, 500);
                } else {
                    if (that.state.flag) {
                        that.chatRecord(res);
                    }
                }
                that.setState({content: "手指上滑,取消发送", flag: true, startTime: 0, num: 0});
                window.clearTimeout(that.state.timeout);
            }
        });
        that.refs.record.style.backgroundColor = '#ffffff';
        that.refs.record.innerHTML = '按住 说话';
    },
    playVoice: function (e) {

        // 只关注点击的元素。
        //返回绑定事件的元素
        var node = e.currentTarget;

        console.log(node);
        for(var i=0; i<node.previousSibling.childNodes.length; i++){
            console.log(node.previousSibling.childNodes[i]);
            if(node.previousSibling.childNodes[i].getAttribute('class') === 'radius'){
                console.log('is ok');
                node.previousSibling.childNodes[i].style.backgroundColor = '#FFF';
            }
        }
        if (this.state.node !== null) {
            this.state.node.firstElementChild.pause();
        }
        this.animate(node);
        node.firstElementChild.play();
        this.setState({node: node});

    },
    endVoice: function () {
        this.animate(this.state.node);
        this.state.node.firstElementChild.play();
    },
    animate: function (e) {
        var eleArr = e.children;
        var arr = [];
        for (var i = 0; i < eleArr.length; i++) {
            if (eleArr[i].tagName === 'SVG') {
                arr.push(eleArr[i]);
            }
            if (eleArr[i].tagName === 'LI') {
                var node = eleArr[i].children;
                for (var k = 0; k < node.length; k++) {
                    arr.push(node[k]);
                }
            }
        }

        for (var j = 0; j < arr.length; j++) {
            (function (index) {
                if (index === 0) {
                    window.setTimeout(function () {
                        arr[index + 2].style.display = 'none';
                        arr[index].style.display = 'block';
                        arr[index + 1].style.display = 'none';
                    }, (index + 1) * 500);

                } else if (index === 1) {
                    window.setTimeout(function () {
                        arr[index - 1].style.display = 'none';
                        arr[index].style.display = 'block';
                        arr[index + 1].style.display = 'none';
                    }, (index + 1) * 500);
                } else {
                    window.setTimeout(function () {
                        arr[index - 2].style.display = 'none';
                        arr[index - 1].style.display = 'none';
                        arr[index].style.display = 'block';
                    }, (index + 1) * 500);
                }
            })(j);
        }
    },
    shouldComponentUpdate: function (nextState) {
        return this.state.message !== nextState.message || this.state.toast !== nextState.message;
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
                                <img className="icon" src="../app/src/image/record.png" onClick={this.toggleText}/>
                            </li>
                            <li ref="record" className="record" onTouchStart={this.touchStart}
                                onTouchMove={this.touchMove} onSelect={this.onFocus}
                                onTouchCancel={this.touchCancel} onTouchEnd={this.touchEnd}>
                                按住 录音
                            </li>
                        </ul>
                    </div>
                    <div className="text" ref="text">
                        <img className="icon" src="../app/src/image/key.png" onClick={this.toggleVoice}/>
                        <input ref="content" type="text" placeholder="请输入想说的话"/>
                        <a href="javascript:void(0);" onClick={this.sendText}>发送</a>
                    </div>
                </footer>
                <ToastLoad ref="toastLoad" content={this.state.content}/>
                <ToastError ref="toastError" toast={this.state.toast}/>
            </div>
        )
    }


});

// export default Chat

module.exports = Chat;