/**
 * Created by user on 2016/8/5.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import ToastError from './ToastError';
import ToastSuccess from './ToastSuccess';
import 'weui';
import '../styles/rail.css';

var Rail = React.createClass({
    getInitialState: function () {   //  init variable
        return {
            url:'http://api.smartlocate.cn/v1/',
            id: 'container',
            map: null,
            toastError: '',
            toastSuccess: '',
            flag: 0,
            location: null,
            radius: 800,
            geoFencingData: null
        }

    },
    componentWillMount: function () {   // get data before loading component
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        CreateXHR({
            url: that.state.url + "device/" + IMEI + "?username=" + username + "&ticket=" + ticket,
            type: "get",
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        var locationData = JSON.parse(data.data.location),
                            location = locationData.location.split(",");
                        that.setState({
                            radius: Number(locationData.radius),
                            location: location,
                            geoFencingData: data.data.geoFencingData
                        });
                        break;
                    default:
                        hashHistory.push('./login');
                        break;
                }
            },
            error: function () {
                that.setState({toastError:'网络错误'});
                that.refs.errorToast.show();
                window.setTimeout(function () {
                    that.refs.errorToast.hide();
                },500);
            },
            complete:function () {
                that.location();
            }
        });
    },
    location: function () {               //loading component
        var map = new AMap.Map(this.state.id, {   //loading map
            zoom: 16,
            center: this.state.location,
            resizeEnable: true
        });
        map.plugin(["AMap.ToolBar", "AMap.Scale"], function () {   //loading toolbar scale
            var tool = new AMap.ToolBar({
                liteStyle: true,
            });
            var scale = new AMap.Scale();
            map.addControl(tool);
            map.addControl(scale);
        });
        this.setState({map: map});              //set map
        map.on("complete", this.completeEventHandler);  // map complete to trigger event

    },
    completeEventHandler: function () {    //completeEventHandler
        var clickListener, position = {}, marker, circle,
            flag = 0, radius = this.state.radius, map = this.state.map;
        var btn = document.getElementsByClassName("btn");   //get btn dom is nodeList
        var that = this;
        AMap.event.addListener(map, 'click', function (e) {  //地图监听事件
            position = {
                lng: e.lnglat.getLng(),  //get click position
                lat: e.lnglat.getLat()
            };
            if (circle) {   //判断是否已经有地图中心
                marker.setMap(null);  //将之前的删除
                circle.setMap(null);
                marker = new AMap.Marker({   // set marker
                    position: e.lnglat,
                    map: map
                });
                circle = new AMap.Circle({    //set circle
                    center: e.lnglat,
                    radius: radius,
                    fillColor: "#138ee2",
                    fillOpacity: 0.1,
                    strokeWeight: 1,
                    strokeOpacity: 0,
                    map: map
                });
            } else {
                marker = new AMap.Marker({
                    position: e.lnglat,
                    map: map
                });
                circle = new AMap.Circle({
                    center: e.lnglat,
                    radius: radius,
                    fillColor: "#138ee2",
                    fillOpacity: 0.1,
                    strokeWeight: 1,
                    strokeOpacity: 0,
                    map: map
                });
            }
        });
        for (let i = 0; i < btn.length; i++) {

            AMap.event.addDomListener(btn[i], 'click', function () {  //btn 监听事件
                switch (i) {
                    case 0:
                        that.handleSubBtn(circle, map);  // sub radius btn
                        break;
                    case 1:
                        that.handleAddBtn(circle, map);   //add radius btn
                        break;
                    case 2:
                        if (!circle) {
                            that.setState({toastError: "请设置围栏中心"});
                            that.refs.errorToast.show();
                            setTimeout(function () {
                                that.refs.errorToast.hide();
                            }, 2000);
                        } else {
                            var array = [],
                                str = String(position.lng) + ',' + String(position.lat) + ',' + String(radius) + '+';
                            if (!that.state.geoFencingData) {

                                array.push(str);
                                that.setState({geoFencingData: array});
                            } else {
                                if (that.state.geoFencingData instanceof Array) {
                                    array = that.state.geoFencingData;
                                    array.push(str);
                                    that.setState({geoFencingData: array});
                                } else {
                                    array = that.state.geoFencingData.split('+');
                                    array[1] = str;
                                    that.setState({geoFencingData: array[0] + '+' + array[1]});

                                }
                            }
                            if (array.length > 2) {
                                that.setState({toastError: "只能设置两个围栏"});
                                that.refs.errorToast.show();         //trigger a warn
                                setTimeout(function () {
                                    that.refs.errorToast.hide();
                                }, 2000);

                            } else {
                                that.handleSubmitBtn();
                            }
                        }
                        break;
                    case 3:
                        console.log('btn3');
                        if(!that.state.geoFencingData){
                            that.setState({toastError: "无围栏"});
                            that.refs.errorToast.show();         //trigger a warn
                            setTimeout(function () {
                                that.refs.errorToast.hide();
                            }, 2000);
                        }else{
                            var deleteArray =[];
                            if( that.state.geoFencingData instanceof Array){
                                deleteArray = that.state.geoFencingData;
                                deleteArray.pop();
                                that.setState({geoFencingData: deleteArray});
                                that.handleDeleteBtn();
                            }else{
                                deleteArray  = that.state.geoFencingData.split('+');
                                deleteArray.pop();
                                if(deleteArray.length === 0){
                                    that.setState({toastError: "无围栏"});
                                    that.refs.errorToast.show();         //trigger a warn
                                    setTimeout(function () {
                                        that.refs.errorToast.hide();
                                    }, 2000);
                                }else if(deleteArray.length === 1){
                                    that.setState({geoFencingData:''});
                                    that.handleDeleteBtn();
                                }else{
                                    that.setState({geoFencingData: deleteArray[0]});
                                    that.handleDeleteBtn();
                                }
                            }
                        }
                        break;
                    case 4:
                        console.log('btn4');
                        that.handleControlBtn(circle);
                        break;
                    case 5:
                        console.log('btn5');
                        that.handleRemoveBtn(circle);
                        break;
                    default:
                        break;
                }
            });
        }
    },
    handleSubBtn: function (e, eMap) {  //减小圆半径函数
        var that = this;
        if (e) {
            if (that.state.radius <= 100) {
                return
            }
            var radius = that.state.radius - 100;
            that.setState({radius: radius});
            e.setRadius(radius);
            e.setMap(eMap);
        } else {
            that.setState({toastError: "请设置围栏中心"});
            that.refs.errorToast.show();
            setTimeout(function () {
                that.refs.errorToast.hide();
            }, 2000);
        }
    },
    handleAddBtn: function (e, eMap) {   //增加圆半径函数
        var that = this;
        if (e) {
            if (that.state.radius >= 2000) {
                return
            }
            var radius = that.state.radius + 100;
            that.setState({radius: radius});
            e.setRadius(radius);
            e.setMap(eMap);
        } else {
            that.setState({toastError: "请设置围栏中心"});
            that.refs.errorToast.show();
            setTimeout(function () {
                that.refs.errorToast.hide();
            }, 2000);
        }
    },
    handleSubmitBtn: function (eId, ePosition, eRadius) {  //提交数据函数
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        var data = {
            username: username,
            ticket: ticket,
            geoFencingFlag: 1,
            geoFencingData: that.state.geoFencingData
        };

        CreateXHR({
            url: that.state.url + "device/" + IMEI,
            type: "put",
            data: data,
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({toastSuccess: "提交成功"});
                        that.refs.successToast.show();
                        setTimeout(function () {
                            that.refs.successToast.hide();
                        }, 2000);
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        that.setState({toastError: "提交失败"});
                        that.refs.errorToast.show();
                        setTimeout(function () {
                            that.refs.errorToast.hide();
                        }, 2000);
                        break;
                }
            },
            error: function () {
                that.setState({toastError:'网络错误'});
                that.refs.errorToast.show();
                window.setTimeout(function () {
                    that.refs.errorToast.hide();
                },500);
            }
        });
    },
    handleDeleteBtn: function () {   //删除数据函数
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");

        var data = {
            username: username,
            ticket: ticket,
            geoFencingFlag: 1,
            geoFencingData: that.state.geoFencingData
        };


        CreateXHR({
            url: that.state.url + "device/" + IMEI,
            type: "put",
            data: data,
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({toastSuccess: "已删除"});
                        that.refs.successToast.show();
                        setTimeout(function () {
                            that.refs.successToast.hide();
                        }, 2000);
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        that.setState({toastError: "删除失败"});
                        that.refs.errorToast.show();
                        setTimeout(function () {
                            that.refs.errorToast.hide();
                        }, 2000);
                        break;
                }
            },
            error: function () {
                that.setState({toastError:'网络错误'});
                that.refs.errorToast.show();
                window.setTimeout(function () {
                    that.refs.errorToast.hide();
                },500);
            }
        });
    },
    handleControlBtn: function (e) {   // 提交监控函数
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        if (e) {
            CreateXHR({
                url: that.state.url + "device/" + IMEI,
                type: "put",
                data: {
                    username: username,
                    ticket: ticket,
                    geoFencingFlag: 0
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.setState({toastSuccess: "已监控"});
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
                            break;
                        default:
                            that.setState({toastError: "监控失败"});
                            that.refs.errorToast.show();
                            setTimeout(function () {
                                that.refs.errorToast.hide();
                            }, 2000);
                            break;
                    }
                },
                error: function () {
                    that.setState({toastError:'网络错误'});
                    that.refs.errorToast.show();
                    window.setTimeout(function () {
                        that.refs.errorToast.hide();
                    },500);
                }
            });
        } else {
            that.setState({toastError: "请设置围栏中心"});
            that.refs.errorToast.show();
            setTimeout(function () {
                that.refs.errorToast.hide();
            }, 2000);
        }
    },
    handleRemoveBtn: function (e) {  //取消监控函数
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        if (e) {
            CreateXHR({
                url: that.state.url + "device/" + IMEI,
                type: "put",
                data: {
                    username: username,
                    ticket: ticket,
                    geoFencingFlag: 1
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.setState({toastSuccess: "已取消"});
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
                            break;
                        default:
                            that.setState({toastError: "取消失败"});
                            that.refs.errorToast.show();
                            setTimeout(function () {
                                that.refs.errorToast.hide();
                            }, 2000);
                            break;
                    }
                },
                error: function () {
                    that.setState({toastError: "请设置围栏中心"});
                    that.refs.errorToast.show();
                    setTimeout(function () {
                        that.refs.errorToast.hide();
                    }, 2000);
                }
            });
        } else {
            that.setState({toastError: "请设置围栏中心"});
            that.refs.errorToast.show();
            setTimeout(function () {
                that.refs.errorToast.hide();
            }, 2000);
        }
    },
    render: function () {
        return (
            <div className="railPage page">
                <div className="btn-group">
                    <img className="btn sub-btn" src="../app/src/image/sub.png"/>
                    <div className="num-btn weui_btn weui_btn_mini weui_btn_default">
                        {this.state.radius}</div>
                    <img className="btn add-btn" src="../app/src/image/add.png"/>
                    <div className="btn submit-btn weui_btn weui_btn_primary weui_btn_mini">确认</div>
                    <div className="btn delete-btn weui_btn weui_btn_primary weui_btn_mini">删除</div>
                    <div className="btn control-btn weui_btn weui_btn_warn weui_btn_mini">监控</div>
                    <div className="btn remove-btn weui_btn weui_btn_warn weui_btn_mini">取消</div>
                </div>
                <div id={this.state.id}></div>
                <ToastError ref="errorToast" toast={this.state.toastError}/>
                <ToastSuccess ref="successToast" toast={this.state.toastSuccess}/>
            </div>
        )
    }
});

// export default Rail;


module.exports =Rail;