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


var Chat = React.createClass({
    getInitialState:function () {
        return {
            content:'手指上滑,取消发送',
            flag:true,
            url:'http://api.smartlocate.cn/v1/',
            key:0,
            startTime:0,
            message:[],
        }
    },
    componentWillMount:function(){
        console.log('this is willMount');
        var that =this,
            username = Cookie('username'),
            ticket = Cookie('ticket'),
            IMEI = Cookie('IMEI');
        CreateXHR({
            type:'GET',
            url:that.state.url + 'device/' + IMEI +'/chatRecord?username='+
                username + '&ticket=' + ticket + '&orderType=timeDesc&startId=0&length=10',
            success: function (res) {
                switch (res.errcode) {
                    case 0:
                        console.log(res.data);
                        var msg = [];
                        for(var i=res.data.length-1; i>=0;i--){
                            if(res.data[i].direction === 2){
                                if(res.data[i].type === 'text'){
                                    let ele = function () {
                                        return (
                                            <div className="message" key={i}>
                                                <p className="date">{res.data[i].created_at}</p>
                                                <div className="bottom">
                                                    <p>{res.data[i].content}</p>
                                                    <div className="bot"></div>
                                                    <img src="../app/src/image/headImage.jpg"/>
                                                </div>
                                            </div>
                                        )
                                    }();
                                    msg.push(ele);
                                }else{
                                    let ele = function () {
                                        return (
                                            <div className="message" key={i}>
                                                <p className="date">{res.data[i].created_at}</p>
                                                <div className="bottom">
                                                    <p onClick={that.playVoice} data-url={res.data[i].voiceUrl}>
                                                        <i className="iconfont" data-url={res.data[i].voiceUrl}
                                                           style={{fontSize:"15px",paddingRight:"1.5rem"}}>&#xe626;</i>
                                                    </p>
                                                    <div className="bot"></div>
                                                    <img src="../app/src/image/headImage.jpg"/>
                                                </div>
                                            </div>
                                        )
                                    }();
                                    msg.push(ele);
                                }
                            }else{
                                let ele = function () {
                                    return (
                                            <div className="message" key={i}>
                                                <p className="date">{res.data[i].created_at}</p>
                                                <div className="bottom deviceBottom">
                                                    <p onClick={that.playVoice} data-url={res.data[i].voiceUrl}>
                                                        <i className="iconfont" data-url={res.data[i].voiceUrl}
                                                           style={{fontSize:"15px",paddingRight:"1.5rem"}}>&#xe626;</i>
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
                        that.setState({message:msg},function () {
                            window.scrollTo(0,window.innerHeight);
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
    componentDidMount:function () {
        console.log(window.location.href);
        CreateXHR({
            type: "GET",
            url: this.state.url + "/system?pageUrl=" + encodeURIComponent(window.location.href),
            success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            console.log(data);
                            wx.config({
                                debug: true,
                                appId: data.data.appId,
                                timestamp: data.data.timestamp,
                                nonceStr: data.data.nonceStr,
                                signature: data.data.signature,
                                jsApiList: [

                                    // 所有要调用的 API 都要加到这个列表中
                                    "onMenuShareTimeline",
                                    "openLocation",
                                    "getLocation",
                                    "chooseImage",
                                    "previewImage",
                                    "uploadImage",
                                    "startRecord",
                                    "stopRecord",
                                    "onVoiceRecordEnd",
                                    "playVoice",
                                    "pauseVoice",
                                    "stopVoice",
                                    "uploadVoice",
                                    "downloadVoice"
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
                console.log(xhr.status +xhr.statusText);
                hashHistory.push('/login');
            }
        });
        RongYun(this.RongYunVoice)

    },
    RongYunVoice:function (message) {
        var that = this;
        if(message.content.content === "MessageReceived") {
            console.log(message);
            console.log(message.content.extra);
            that.refs.msg.scrollTop = that.refs.msg.scrollHeight;
            var ele = function () {
                return (
                    <div className="message" key={'user'+that.state.key}>
                        <p className="date">{message.content.extra.created_at}</p>
                        <div className="bottom deviceBottom">
                            <p onClick={that.playVoice} data-url={message.content.extra.mp3Url}>
                                <i className="iconfont" data-url={message.content.extra.mp3Url}
                                   style={{fontSize:"15px",paddingRight:"1.5rem"}}>&#xe626;
                                </i>
                            </p>
                            <div className="bot"></div>
                            <img src="../app/src/image/headImage.jpg"/>
                        </div>
                    </div>
                )
            }();
            var msg = that.state.message;
            msg.push(ele);
            that.setState({message:msg,key:that.state.key+1},function () {
                window.scrollTo(0,window.innerHeight);
            });
        }
    },
    toggleText:function () {
        this.refs.btn.style.display = "none";
        this.refs.text.style.display = "flex";
    },
    toggleVoice:function () {
        this.refs.btn.style.display = "flex";
        this.refs.text.style.display = "none";
    },
    chatRecord:function (res) {              //sendRecord


        wx.translateVoice({
            localId: res.localId,         // 需要识别的音频的本地Id，由录音相关接口获得
            isShowProgressTips: 1,            // 默认为1，显示进度提示
            success: function (res) {
                console.log(res);
                console.log(res.translateResult);   // 语音识别的结果
            }
        });

        var Obj = new Date(), hour = Obj.getHours(), minute = Obj.getMinutes(),
            date = hour + ':' + minute;
        var ele = function () {
            return (
                <div className="message" key={'user' + that.state.key}>
                    <p className="date" style={{width: "2.9rem"}}>{date}</p>
                    <div className="bottom">
                        <p onClick={that.playVoice} data-url={res.localId}>
                            <i className="iconfont" data-url={res.localId}
                               style={{fontSize: "15px", paddingRight: "1.5rem"}}>&#xe626;
                            </i>
                        </p>
                        <div className="bot"></div>
                        <img src="../app/src/image/headImage.jpg"/>
                    </div>
                </div>
            )
        }();
        var msg = that.state.message;
        msg.push(ele);
        that.setState({message: msg, key: that.state.key + 1},function () {
            window.scrollTo(0,window.innerHeight);       //将窗口滚到最底部

        });

        wx.uploadVoice({
            localId: res.localId,            // 需要上传的音频的本地ID，由stopRecord接口获得
            isShowProgressTips: 1,          // 默认为1，显示进度提示
            success: function (res) {
                console.log(res);          // 返回音频的服务器端ID serverId

                CreateXHR({
                    type: "post",
                    url: that.state.url + "device/+" + IMEI + "/voice",
                    data: {
                        username: username,
                        ticket: ticket,
                        wechatMediaId: res.serverId
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
            }
        });

    },
    sendText:function () {
        var that = this,
            IMEI = Cookie("IMEI"),
            username = Cookie("username"),
            ticket = Cookie("ticket");
        var val = that.refs.content.value;
        that.refs.content.value = '';
        var Obj = new Date(), hour = Obj.getHours(), minute = Obj.getMinutes(),
            date = hour + ':' +minute;
        var ele = function () {
            return (
                <div className="message" key={'user'+that.state.key}>
                    <p className="date" style={{width:"2.9rem"}}>{date}</p>
                    <div className="bottom">
                        <p>{val}</p>
                        <div className="bot"></div>
                        <img src="../app/src/image/headImage.jpg"/>
                    </div>
                </div>
            )
        }();
        var msg = that.state.message;
        msg.push(ele);
        that.setState({message:msg,key:that.state.key+1},function () {
            window.scrollTo(0,window.innerHeight);
        });
        CreateXHR({
                type: "post",
                url: this.state.url + "device/"+IMEI+"/text",
                data:{
                    username:username,
                    ticket:ticket,
                    content:val
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

    touchStart:function (e) {
        e.preventDefault();
        var that = this;
        console.log('start');
        wx.startRecord();
        this.refs.toastLoad.show();
        var time = new Date().getTime();
        this.setState({startTime:time});
        wx.onVoiceRecordEnd({                     // 录音时间超过一分钟没有停止的时候会执行 complete 回调
            complete: function (res) {
                that.chatRecord(res);
            }
        });
    },
    touchMove:function (e) {
        e.preventDefault();
        console.log('move');
        this.setState({content:"松开手指,取消发送",flag:false});
    },
    touchCancel:function () {
        console.log('cancel');
    },
    touchEnd:function (e) {
        e.preventDefault();
        var that = this,
            IMEI = Cookie("IMEI"),
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            time = new Date().getTime();
        console.log('end');
        if((time - that.state.startTime) < 300){
            that.refs.toastError.show();
            window.setTimeout(function () {
                that.refs.toastError.hide();
            },500)
        }else {

            this.refs.toastLoad.hide();
            console.log(this.state.flag);
            wx.stopRecord({
                success: function (res) {
                    console.log(res);           //返回本地ID res.localId

                    if (that.state.flag) {

                        that.chatRecord(res);
                        // wx.translateVoice({
                        //     localId: res.localId,         // 需要识别的音频的本地Id，由录音相关接口获得
                        //     isShowProgressTips: 1,            // 默认为1，显示进度提示
                        //     success: function (res) {
                        //         console.log(res);
                        //         console.log(res.translateResult); // 语音识别的结果
                        //     }
                        // });
                        // that.refs.msg.scrollTop = that.refs.msg.scrollHeight;
                        // var Obj = new Date(), hour = Obj.getHours(), minute = Obj.getMinutes(),
                        //     date = hour + ':' + minute;
                        // var ele = function () {
                        //     return (
                        //         <div className="message" key={'user' + that.state.key}>
                        //             <p className="date" style={{width: "2.9rem"}}>{date}</p>
                        //             <div className="bottom">
                        //                 <p onClick={that.playVoice} data-url={res.localId}>
                        //                     <i className="iconfont" data-url={res.localId}
                        //                        style={{fontSize: "15px", paddingRight: "1.5rem"}}>&#xe626;
                        //                     </i>
                        //                 </p>
                        //                 <div className="bot"></div>
                        //                 <img src="../app/src/image/headImage.jpg"/>
                        //             </div>
                        //         </div>
                        //     )
                        // }();
                        // var msg = that.state.message;
                        // msg.push(ele);
                        // that.setState({message: msg, key: that.state.key + 1},function () {
                        //     window.scrollTo(0,window.innerHeight);  //将窗口滚到最底部
                        //
                        // });
                        //
                        // wx.uploadVoice({
                        //     localId: res.localId,            // 需要上传的音频的本地ID，由stopRecord接口获得
                        //     isShowProgressTips: 1,          // 默认为1，显示进度提示
                        //     success: function (res) {
                        //         console.log(res);          // 返回音频的服务器端ID serverId
                        //         CreateXHR({
                        //             type: "post",
                        //             url: that.state.url + "device/+" + IMEI + "/voice",
                        //             data: {
                        //                 username: username,
                        //                 ticket: ticket,
                        //                 wechatMediaId: res.serverId
                        //             },
                        //             success: function (data) {
                        //                 switch (data.errcode) {
                        //                     case 0:
                        //                         console.log(data);
                        //                         break;
                        //                     case 44001:
                        //                         hashHistory.push('/login');
                        //                         break;
                        //                     default:
                        //                         hashHistory.push('/login');
                        //                         break;
                        //                 }
                        //             },
                        //             error: function (xhr) {
                        //                 console.log(xhr.status + xhr.statusText);
                        //                 hashHistory.push('/login');
                        //             }
                        //         });
                        //     }
                        // });
                    } else {
                        this.setState({flag: true});
                    }
                },
                fail: function (res) {
                    console.log('fail' + res);
                }
            });
        }
    },
    playVoice:function (e) {
        console.log('playVoice');
        console.log(e.target.dataset);

        var localId = e.target.dataset;
        wx.playVoice({
            localId:localId,
        });

    },
    shouldComponentUpdate:function (nextState) {

        if(this.state.message !== nextState.message){
            return true;
        }else{
            return false;
        }
    },
    render:function () {
        return(
            <div className="page chatPage">
                <div className="content" ref="scroll">
                    {this.state.message}
                </div>
                <footer>
                    <div className="btn" ref="btn">
                        <ul>
                            <li className="icon">
                                <img src='../app/src/image//record.png' onClick={this.toggleText} />
                            </li>
                            <li className="record" onTouchStart={this.touchStart} onTouchMove={this.touchMove}
                            onTouchCancel={this.touchCancel} onTouchEnd={this.touchEnd}>
                                按住 录音
                            </li>
                        </ul>
                    </div>
                    <div className="text" ref="text">
                        <img src='../app/src/image//record.png' onClick={this.toggleVoice} />
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
