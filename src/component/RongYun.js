/**
 * Created by user on 2016/11/28.
 */
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';


var url = 'http://api.smartlocate.cn/v1/';
var RongYun = function (callback) {
    var that = this,
        username = Cookie('username'),
        ticket = Cookie('ticket');
    CreateXHR({                         //get rongCloudAppKey and rongCloudToken
        url: url +"user/" + username + "?ticket=" + ticket,
        type: "get",
        success: function (data) {
            switch (data.errcode) {
                case 0:
                    Cookie("appKey", data.data.rongCloudAppKey);
                    Cookie("token", data.data.rongCloudToken);
                    break;
                default:
                    hashHistory.push('/user/login');
                    break;
            }
        },
        error: function (xhr) {
            console.log(xhr.status + xhr.statusText);
            hashHistory.push('/user/login');
        },
        complete:function () {

            console.log('complete');
            var id = Cookie("appKey"),
                token = Cookie("token");

            RongIMClient.init(id);            //融云init

            RongIMClient.setConnectionStatusListener({               //融云连接事件监听
                onChanged: function (status) {
                    switch (status) {
                        case RongIMLib.ConnectionStatus.CONNECTED:
                            break;
                        case RongIMLib.ConnectionStatus.CONNECTING:
                            break;
                        case RongIMLib.ConnectionStatus.DISCONNECTED:
                            break;
                        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                            break;
                        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                            break;
                    }
                }
            });
            RongIMClient.setOnReceiveMessageListener({            //消息监听事件
                onReceived: function (msg) {
                    console.log('is ok');
                    callback(msg);
                }
            });
            RongIMClient.connect(token, {      //融云连接
                onSuccess:function () {
                    return '';
                },
                onTokenIncorrect: function() {
                    console.log('token incorrect');
                    CreateXHR({                         //get rongCloudAppKey and rongCloudToken
                        url: url + "user/"+username+"/updateRongCloudToken?ticket=" + ticket,
                        type: "get",
                        success: function (data) {
                            switch (data.errcode) {
                                case 0:
                                    id = data.data.rongCloudAppKey;
                                    token = data.data.rongCloudToken;
                                    Cookie("appKey", data.data.rongCloudAppKey);
                                    Cookie("token", data.data.rongCloudToken);
                                    break;
                                default:
                                    hashHistory.push('/user/login');
                                    break;
                            }
                        },
                        error: function (xhr) {
                            console.error(xhr.status,xhr.statusText);
                            hashHistory.push('/user/login');
                        },
                        complete:function () {
                            RongIMClient.reconnect({
                                onSuccess: function (userId) {
                                    console.log('reConnect success');
                                },
                                onError:function (errorCode) {
                                    console.log(errorCode);
                                    hashHistory.push('/user/login');
                                }
                            });
                        }
                    });
                },
                onError: function (errorCode) {
                    console.log(errorCode);
                    hashHistory.push('/user/login');
                }
            });
        }
    });
};

export default RongYun;