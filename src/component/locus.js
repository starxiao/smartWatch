/**
 * Created by user on 2016/8/3.
 */

import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';
import ToastLoad from './ToastLoad';
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
                        default:
                            hashHistory.push('/user/login');
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
    displayMaker:function (data) {
        var map = this.state.map,lineArray = [];
        for (let i = 0; i < data.length; i++) {
            var locateData = data[i].LocationStruct.location.split(',');
            lineArray[i] = [Number(locateData[0]), Number(locateData[1])];
        }
        map.clearMap();    //清除地图的覆盖物，比如之前的回放
        map.setCenter(new AMap.LngLat(lineArray[0][0], lineArray[0][1]));    //重新设置地图中心
        map.setZoom(15);
        for(var j=0; j<lineArray.length; j++){
            new AMap.Marker({
                position: lineArray[j],
                autoRotation: true,
                map: map
            });
        }

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
                        that.refs.toastLoad.hide();
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
    handleToday(){                  //今天的回放
        this.refs.toastLoad.show();
        var func = this.displayMaker;
        console.log(today +'-' + yesterday + '-'+bYesterday);
        var start = today;
        console.log(start);
        this.handleAjax(start,func);
    },
    handleYesterday(){                  //昨天的回放
        this.refs.toastLoad.show();
        console.log(today +'-' + yesterday + '-'+bYesterday);
        var func = this.displayMaker;
        this.handleAjax(yesterday,func,today);
    },
    handleBYesterday(){             //前天的回放
        this.refs.toastLoad.show();
        console.log(today +'-' + yesterday + '-'+bYesterday);
        var func = this.displayMaker;
        this.handleAjax(bYesterday,func,yesterday);
    },

    render() {
        return (
            <div className="locusPage page">
                <div className="hd">
                    <ul className="nav">
                        <li onClick={this.handleBYesterday}><a href="javascript:">前天</a></li>
                        <li onClick={this.handleYesterday}><a href="javascript:">昨天</a></li>
                        <li onClick={this.handleToday}><a href="javascript:">今天</a></li>
                    </ul>
                </div>
                <div className="bd">
                    <div id={this.state.id}></div>
                </div>
                <ToastLoad ref="toastLoad" content="数据加载中"/>
                <ToastError ref="toastError" toast={this.state.toast}/>
            </div>
        )
    }

});

// export default Locus;

module.exports = Locus;