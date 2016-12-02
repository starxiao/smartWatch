
import React from 'react';
import ToastLoad from './ToastLoad';
import CreateXHR from './xhr';
import Cookie from './cookie';
import RongYun from './RongYun';
import 'weui';
import '../styles/locate.css';


var Locate = React.createClass({

    getInitialState: function () {
        return {
            id: 'container',
            map: null,
            data: {
                nick: '',
                electricity: 100,
                style: '',
                time: '',
                position: null,
                MyLocation: null,
            }
        };
    },


    componentWillMount: function () {
        var IMEI = Cookie("IMEI"),
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            that = this;

        CreateXHR({
            url: "http://api.smartlocate.cn/v1/device/" + IMEI + "?username=" + username + "&ticket=" + ticket,
            type: "get",
            success: function (data) {

                switch (data.errcode) {
                    case 0:
                        console.log(data);
                        var locationData = JSON.parse(data.data.location),
                            location = {
                                nick: data.data.nick,
                                electricity: data.data.electricity,
                                //style: "GPS/LBS",
                                //time: '2016-08-03 10:02:05',
                                time: locationData.created_at,
                                style: locationData.type,
                                position: locationData.location.split(","),
                                MyLocation: locationData.desc
                            };
                        that.setState({data: location});
                        break;
                    case 20003:
                        break;
                    case 20004:
                        break;
                    case 44001:
                        console.log("is error");
                        window.location.href = 'http://app.smartlocate.cn/build/build.html#/login';
                        break;
                    default:
                        break;
                }
            },

            complete: function () {
                that.myLocation();
                CreateXHR({                         //get rongCloudAppKey and rongCloudToken
                    url: "http://api.smartlocate.cn/v1/user/" + username + "?ticket=" + ticket,
                    type: "get",
                    success: function (data) {
                        switch (data.errcode) {
                            case 0:
                                Cookie("appKey", data.data.rongCloudAppKey);
                                Cookie("token", data.data.rongCloudToken);
                                break;
                            case 44001:
                                console.log("is error");
                                window.location.href = 'http://app.smartlocate.cn/build/build.html#/login';
                                break;
                            default:
                                break;
                        }
                    },
                    error: function (status, err) {
                        console.error(status, err.toString());
                    }
                });
            },
            error: function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }
        });
        RongYun(that.handleData);
    },

    myLocation: function () {
        var that = this;
        this.setState({id: 'container'});
        var map = new AMap.Map(that.state.id, {    // create map
            zoom: 17,
            center: that.state.data.position
        });

        map.plugin(["AMap.ToolBar", "AMap.Scale"], function () {   //loading toolbar scale
            var tool = new AMap.ToolBar({
                liteStyle: true,
            });
            var scale = new AMap.Scale();
            map.addControl(tool);
            map.addControl(scale);
        });
        that.setState({map: map});
        map.on("complete", this.completeEventHandler);



    },

    completeEventHandler: function () {
        var marker, circle, map = this.state.map,
            content = '<div class="locate_img"><i class="iconfont">&#xe609;</i></div>'; //set icon
        marker = new AMap.Marker({                        //set marker
            position: this.state.data.position,
            content: content,
            offset: new AMap.Pixel(-25, -80),
            map: map
        });
        circle = new AMap.Circle({                       // create circle
            center: this.state.data.position,
            radius: 200,
            fillColor: "#138ee2",
            fillOpacity: 0.1,
            strokeWeight: 1,
            strokeOpacity: 0,
            map: map
        });

        var info = [];
        info.push("昵称 : "+this.state.data.nick+"     电量 :  "+this.state.data.electricity);
        info.push("定位类型 :  "+this.state.data.style+"   定位时间 :  "+this.state.data.time);
        info.push("定位时间 :  "+this.state.data.time);
        info.push("地址 : "+this.state.data.MyLocation);
        var title = '<div class="info"> <div class="row">昵称 : '+this.state.data.nick+'    电量  :  '+this.state.data.electricity+'</div> <div class="row">定位类型 : '+this.state.data.style+'</div> <div class="row">定位时间 :'+this.state.data.time+'</div> <div class="row">地址 : '+this.state.data.MyLocation+'</div> </div>' +
            '<div class="canvas"></div>';
        var infoWindow = new AMap.InfoWindow({
            isCustom: true,
            closeWhenClickMap:false,
            content: title,
            offset: new AMap.Pixel(25, -90)
        });
        infoWindow.open(map, this.state.data.position);
    },

    handleData: function (message) {

        console.log("handle data");
        this.refs.toastLoad.hide();
        if (message.content.content === "LocationUpdated") {
            console.log(message);

            var objData = {
                nick: message.content.extra.nick,
                style: message.content.extra.locationType,
                electricity: this.state.data.electricity,
                time: message.content.extra.created_at,
                position: [message.content.extra.lng, message.content.extra.lat],
                MyLocation: message.content.extra.desc
            };
            this.setState({data: objData});
        }
        this.myLocation();
    },
    handleIphone: function () {    //handle click iphone


    },
    touchStart:function () {
      this.refs.locateImg.style.opacity = '0.5';
    },
    touchEnd: function () {                   //click baby btn to update map

        var username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI"),
            that = this;
        this.refs.locateImg.style.opacity = '1';
        that.refs.toastLoad.show();
        CreateXHR({
            url: "http://api.smartlocate.cn/v1/device/"+IMEI+"/action/location",
            type: "post",
            data:{
                username:username,
                ticket:ticket
            },
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        break;
                    case 44001:
                        window.location.href = 'http://app.smartlocate.cn/build/build.html#/login';
                        break;
                    default:
                        break;
                }
            },
            error: function (status, err) {
                console.error(status, err.toString());
            }
        });
    },
    render: function () {
        return (
            <div className="locatePage page">
                <div className="bd">
                    <div id={this.state.id}></div>
                    <img className="locateImg" ref="locateImg" src="../app/src/image/locate.png"
                         onTouchStart={this.touchStart} onTouchEnd={this.touchEnd}/>
                    {/*<a href="javascript:" className="image weui_btn weui_btn_mini weui_btn_warn"*/}
                       {/*onClick={this.handleBaby}>baby</a>*/}
                </div>
                <ToastLoad ref="toastLoad" content="数据加载中"/>
            </div>
        )
    }
});

export default Locate;
