/**
 * Created by user on 2016/8/3.
 */

import React from 'react';
import CreateXHR from './xhr';
import Cookie from './cookie';
import ToastError from './ToastError';
import {today, yesterday, bYesterday} from './time';
import '../styles/locus.css';


var Locus = React.createClass({
    getInitialState: function () {
        return ({
            url:'http://api.smartlocate.cn/v1/',
            toast:"没有定位数据",
            id: 'container',        //地图的id
            map: null,
            today: today,             //获取时间
            yesterday: yesterday,
            bYesterday: bYesterday,
            position:null,
        })
    },
    componentWillMount: function () {             //加载组件之前获取数据

            var that = this,
                IMEI = Cookie("IMEI"),
                username = Cookie("username"),
                ticket = Cookie("ticket");

            CreateXHR({
                url: that.state.url + "device/" + IMEI + "?username=" + username + "&ticket=" + ticket,
                type: "get",
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            var locationData = JSON.parse(data.data.location),
                                position = locationData.location.split(",");
                            that.setState({position: position});
                            break;
                        case 20003:
                            break;
                        case 20004:
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
                            break;
                        default:
                            break;
                    }
                },
                error: function () {
                    that.setState({toast:'网络错误'});
                    that.refs.toastError.show();
                    window.setTimeout(function () {
                        that.refs.toastError.hide();
                    },500);
                },
                complete:function () {
                    that.location();
                }
            });
    },

    location: function () {

        var that = this;
        var map = new AMap.Map(that.state.id, {    // create map
            zoom: 17,
            center: that.state.position
        });
        map.plugin(["AMap.ToolBar", "AMap.Scale"], function () {   //loading toolbar scale
            var tool = new AMap.ToolBar({
                offset:new AMap.Pixel(10,150),
                liteStyle: true
            });
            var scale = new AMap.Scale({
                offset:new AMap.Pixel(10,50),
            });
            map.addControl(tool);
            map.addControl(scale);
        });
        that.setState({map: map});
        map.on('complete', that.completeEventHandler);   //地图加载完成事件
    },
    completeEventHandler: function () {
        var that = this;
        var map = that.state.map;
        var marker = new AMap.Marker({
            position: that.state.position,
            map: map
        })

    },
    displayMap: function (data) {           // display data
        var circle, polyLine, map = this.state.map,
            lineArray = [];

        for (let i = 0; i < data.length; i++) {
            var locateData = data[i].LocationStruct.location.split(',');
            lineArray[i] = [Number(locateData[0]), Number(locateData[1])];
         }

        map.clearMap();    //清除地图的覆盖物，比如之前的回放
        map.setCenter(new AMap.LngLat(lineArray[0][0], lineArray[0][1]));    //重新设置地图中心
        map.setZoom(16);
        for (let i = 0; i < 4; i++) {
            setTimeout(function () {
                circle = new AMap.Circle({
                    center: new AMap.LngLat(lineArray[i][0], lineArray[i][1]),
                    radius: 20,
                    strokeColor: "#F33",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    fillColor: "#ee2200",
                    fillOpacity: 0.35,
                    map: map
                });
            }, i * 1000);
        }
        setTimeout(function () {
            polyLine = new AMap.Polyline({
                path: lineArray,
                strokeColor: "#FF293A",
                strokeStyle: "solid",
                strokeWeight: 3,
                strokeOpacity: 0.9,
                map: map
            });
        }, 4 * 1000);
    },


    displayRail: function (data) {                    //轨迹回放
        var marker, polyLine, map = this.state.map,lineArray = [];
            // lineArray = [                 //建立路线数组
            //     [113.931429, 22.529885],
            //     [113.931333, 22.529922],
            //     [113.931106, 22.529955],
            //     [113.930935, 22.530014],
            //     [113.930764, 22.530032],
            //     [113.930472, 22.530222],
            //     [113.930477, 22.530156],
            //     [113.930445, 22.530339],
            //     [113.930553, 22.530573],
            //     [113.930558, 22.530652],
            //     [113.930585, 22.530811],
            //     [113.930582, 22.530911],
            // ];
        for (let i = 0; i < data.length; i++) {
            var locateData = data[i].LocationStruct.location.split(',');
            lineArray[i] = [Number(locateData[0]), Number(locateData[1])];
         }

        map.clearMap();    //清除地图的覆盖物，比如之前的回放
        map.setCenter(new AMap.LngLat(lineArray[0][0], lineArray[0][1]));    //重新设置地图中心
        map.setZoom(16);
        var icon = new AMap.Icon({
            image: '../app/src/image/map.png',
        });
        marker = new AMap.Marker({   //  起点
            position: [113.931429, 22.529885],
            icon: icon,
            autoRotation: true,
            //offset:new AMap.Pixel(-17,-42),
            map: map
        });


        polyLine = new AMap.Polyline({            //建立路线
            path: lineArray,
            strokeColor: "#FF293A",
            strokeStyle: "solid",
            strokeWeight: 3,
            strokeOpacity: 0.9,
            map: map
        });
        marker.moveAlong(lineArray, 180);   //回放函数  数字设置时间 千米每小时
    },

    handleAjax(startAt,func,endAt){     //请求数据
        var that =this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");

        CreateXHR({
            url: that.state.url + 'device/' + IMEI + "/locationRecord?username="+username+"&ticket="+ticket+"&startAt="+startAt+"&endAt="+endAt,
            type: "get",
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        if (!data.data){
                            that.setState({toast:'没有定位数据'});
                            that.refs.toastError.show();
                            window.setTimeout(function () {
                                that.refs.toastError.hide();
                            },1000);
                        }else{
                            func(data.data);
                        }
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        break;
                }
            },
            error: function () {
                that.setState({toast:'网络错误'});
                that.refs.toastError.show();
                window.setTimeout(function () {
                    that.refs.toastError.hide();
                },500);
            }
        });
    },

    handleMinute: function () {              //10分钟轨迹

        //this.displayMap();
        var time = new Date(),
            myYear = time.getFullYear(),
            myMonth = time.getMonth() + 1,
            myDate = time.getDate(),
            myHour = time.getHours(),
            myMinute = time.getMinutes(),
            endAt = myYear+'-'+myMonth+'-'+myDate+' '+myHour+':'+myMinute+":0";

        if(myMinute < 10){
            myHour = myHour -1;
            myMinute = 50 + myMinute;
        }else{
            myMinute = myMinute-10;
        }
        var startAt = myYear+'-'+myMonth+'-'+myDate+' '+myHour+':'+myMinute+":0",
            func = this.displayMap;
        this.handleAjax(startAt,func,endAt);
    },
    handleHour: function () {            //一小时轨迹
        var time = new Date(),
            myYear = time.getFullYear(),
            myMonth = time.getMonth() + 1,
            myDate = time.getDate(),
            myHour = time.getHours(),
            myHour10 = myHour-1,
            myMinute = time.getMinutes(),
            startAt = myYear+'-'+myMonth+'-'+myDate+' '+myHour10+':'+myMinute+":0",
            endAt = myYear+'-'+myMonth+'-'+myDate+' '+myHour+':'+myMinute+":0";
        var func = this.displayMap;
        console.log(startAt,  endAt);
        this.handleAjax(startAt,func,endAt);
    },
    handleToday(){                  //今天的回放
        var time = new Date(),
            myYear = time.getFullYear(),
            myMonth = time.getMonth() + 1,
            myDate = time.getDate(),
            startAt = myYear+'-'+myMonth+'-'+myDate;
        console.log(startAt);

        var func = this.testFunc;
        this.handleAjax(startAt,func);
    },
    handleYesterday(){           //昨天的回放
        var time = new Date(),
            myYear = time.getFullYear(),
            myMonth = time.getMonth() + 1,
            myDate = time.getDate();
            console.log(this.state.yesterday);
        var yesterday = this.state.yesterday.split('');
        if(myMonth === 1){
            if(myDate === 1){
                myYear = myYear -1;
            }
            if(myDate === 2){
                myYear = myYear -1;
            }
        }

        var startAt = myYear+'-'+yesterday[0]+'-'+yesterday[3];
        console.log(startAt);
        var func = this.displayRail;
        this.handleAjax(startAt,func);
    },
    handleBYesterday(){             //前天的回放
        var time = new Date(),
            myYear = time.getFullYear(),
            myMonth = time.getMonth() + 1,
            myDate = time.getDate();
            var yesterday = this.state.bYesterday.split('');
        if(myMonth === 1){
            if(myDate === 1){
                myYear = myYear -1;
            }
            if(myDate === 2){
                myYear = myYear -1;
            }
        }
        var startAt = myYear+'-'+yesterday[0]+'-'+yesterday[3];
        console.log(startAt);
        var func = this.displayRail;
        this.handleAjax(startAt,func);
    },
    handleClick: function () {          //点击弹出
        console.log("onclick");
        var id = document.getElementById("time"),
            display = window.getComputedStyle(id, null)["display"];
        if (display == "none") {
            id.style.display = "block";
        } else {
            id.style.display = "none";
        }
    },

    render() {
        return (
            <div className="locusPage page">
                <div className="hd">
                    <ul className="nav">
                        <li onClick={this.handleMinute}><a href="javascript:">10分钟</a></li>
                        <li onClick={this.handleHour}><a href="javascript:">1小时</a></li>
                        <li onClick={this.handleClick}><a href="javascript:">轨迹</a></li>
                    </ul>
                </div>
                <div className="bd">
                    <div id="time" className="time">
                        <div className="today">
                            <a href="javascript:void(0);" onClick={this.handleToday}>今天<br/>{this.state.today}</a>
                        </div>
                        <div className="yesterday">
                            <a href="javascript:void(0);" onClick={this.handleYesterday}>昨天<br/>{this.state.yesterday}</a>
                        </div>
                        <div className="bYesterday">
                            <a href="javascript:void(0);" onClick={this.handleBYesterday}>前天<br/>{this.state.bYesterday}
                            </a>
                        </div>
                    </div>
                    <div id={this.state.id}></div>
                </div>
                <ToastError ref="toastError" toast={this.state.toast}/>
            </div>
        )
    }

});

export default Locus;