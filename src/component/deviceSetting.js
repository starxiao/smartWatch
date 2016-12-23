/**
 * Created by xxx on 2016/8/14.
 */

import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import DialogCancel from './dialogCancel';
import ToastSuccess from './ToastSuccess';
import 'weui';


var Device = React.createClass({
    getInitialState: function () {

        var username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        return {
            node: null,
            title: null,
            dialogNode: null,
            dialogTitle: null,
            toastSuccess: null,
            ajax: {
                username: username,
                ticket: ticket,
                IMEI: IMEI
            },
            data: {
                nick: null,
                telephone:null,
                emergencyPhone: null,
                volume: null,
                workModel: null,
                familyPhone: null,
                forbiddenTime:null
            }
        }
    },
    componentDidMount: function () {

        var that = this;

        CreateXHR({
            url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI + "?username=" + that.state.ajax.username + "&ticket=" + that.state.ajax.ticket,
            type: "get",
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        console.log(data.data);

                        var workModel = '', familyPhone = data.data.familyPhone.split(","),
                            emergencyPhone = data.data.emergencyPhone.split(","),
                            arr = data.data.forbiddenTime.split(","), forbiddenTime = [];
                        for (var i = 0; i < arr.length; i++) {
                            forbiddenTime.push(arr[i].split("-"));
                        }
                        console.log(forbiddenTime);
                        if (data.data.work_model === 0) {
                            workModel = "紧急模式:1分钟/次";
                        }else if(data.data.work_model === 1){
                            workModel = "正常模式:10分钟/次";
                        }else {
                            workModel = "省电模式:1小时/次";
                        }
                        var objData = {
                            nick: data.data.nick,
                            volume: data.data.volume,
                            emergencyPhone: emergencyPhone,
                            workModel: workModel,
                            familyPhone: familyPhone,
                            forbiddenTime: forbiddenTime
                        };
                        that.setState({data: objData});
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        break;
                }

            },
            error: function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }
        });

    },
    concat: function (element) {
        var inputValue = [], str = '';

        for (var j = 0; j < element.length; j++) {
            inputValue.push(element[j].value.trim());
            element[j].value = null;
        }
        if (inputValue[0] === '') {
            return null;
        }

        for (var i = 0; i < inputValue.length; i++) {
            if (inputValue[i] === ''){
                continue;
            }
            str += inputValue[i] + ',';    // 在数据后面加逗号隔开

        }
        str = str.substring(0, str.length - 1);
        return str;
    },
    handleNick: function () {

        var child =
                <div className="weui_cells weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">昵称</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="nick weui_input" placeholder="请输入昵称"/>
                        </div>
                    </div>
                </div>,
            title = "修改昵称",
            that = this,
            dialog = that.refs.dialogCancel;
        that.setState({toastSuccess: "修改成功"});
        that.setState({dialogTitle: title});
        that.setState({dialogNode: child},function () {
           document.getElementsByClassName("nick")[0].value = '';
        });

        dialog.show(function () {

            var ele = document.getElementsByClassName("nick"),
                str = ele[0].value.trim();
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI,
                type: "put",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    nick: str
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            var objData = that.state.data;
                            objData.nick = str;
                            that.setState({data:objData});
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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

        that.setState({dialogTitle: "监控号码"});
        that.setState({toastSuccess: "监控成功"});
        that.setState({dialogNode: child},function () {
            document.getElementsByClassName("number")[0].value = '';
        });

        dialog.show(function () {

            var ele = document.getElementsByClassName("number"),
                str = ele[0].value.trim();
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI + "/action/monitor",
                type: "post",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    telephone: str
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            /*
                            var objData = that.state.data;
                            objData.telephone = str;
                            that.setState({data:objData});*/
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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


    handleSOS: function () {
        var child =
                <div className="weui_cells weui_cells_access" style={{fontSize:"1rem"}}>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码1</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码2</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码3</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                </div>,
            that = this,
            dialog = that.refs.dialogCancel;
        that.setState({dialogTitle: "SOS号码"});
        that.setState({toastSuccess: "提交成功"});

        that.setState({dialogNode: child}, function () {
            var element = document.getElementsByClassName("phone");

            for (var key = 0; key < element.length; key++) {
                console.log("is");
                element[key].value = that.state.data.emergencyPhone[key];
            }

        });

        dialog.show(function () {

            var element = document.getElementsByClassName("phone"),
                str = that.concat(element);

                console.log(str);
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI,
                type: "put",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    emergencyPhone: str
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);

                            var emergencyPhone = str.split(",");
                            var objData = that.state.data;
                            objData.emergencyPhone = emergencyPhone;
                            that.setState({data:objData});
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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
    handleFamily:function () {
        var child =
                <div className="weui_cells weui_cells_access" style={{fontSize:"1rem"}}>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码1</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码2</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码3</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码4</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                </div>,
            that = this,
            dialog = that.refs.dialogCancel;
        that.setState({dialogTitle: "亲情号码"});
        that.setState({toastSuccess: "提交成功"});

        that.setState({dialogNode: child}, function () {
            var element = document.getElementsByClassName("phone");

            for (var key = 0; key < element.length; key++) {
                console.log("is");
                element[key].value = that.state.data.familyPhone[key];
            }

        });

        dialog.show(function () {

            var element = document.getElementsByClassName("phone"),
                str = that.concat(element);
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI,
                type: "put",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    familyPhone: str
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);

                            var familyPhone = str.split(",");
                            var objData = that.state.data;
                            objData.familyPhone = familyPhone;
                            that.setState({data:objData});
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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

    handleModel: function () {
        var child =
                <div className="weui_cells weui_cells_radio">
                    <label className="weui_cell weui_check_label">
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>紧急模式:1分钟/次</p>
                        </div>
                        <div className="weui_cell_ft">
                            <input type="radio" className="workModel weui_check" name="radio1" id="x11" value="1"/>
                            <span className="weui_icon_checked"/>
                        </div>
                    </label>
                    <label className="weui_cell weui_check_label">
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>正常模式:10分钟/次</p>
                        </div>
                        <div className="weui_cell_ft">
                            <input type="radio" className="workModel weui_check" name="radio1" id="x10" value="0"/>
                            <span className="weui_icon_checked"/>
                        </div>
                    </label>
                    <label className="weui_cell weui_check_label">
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>省电模式:1小时/次</p>
                        </div>
                        <div className="weui_cell_ft">
                            <input type="radio" className="workModel weui_check" name="radio1" id="x11" value="1"/>
                            <span className="weui_icon_checked"/>
                        </div>
                    </label>
                </div>,
            that = this,
            title = "工作模式",
            dialog = that.refs.dialogCancel;
        that.setState({dialogNode: child});
        that.setState({dialogTitle: title});
        that.setState({toastSuccess: "提交成功"});


        dialog.show(function () {
            var ele = document.getElementsByClassName("workModel"), str = 0;
            if (ele[0].checked) {
                str = 0;
            } else if(ele[1].checked) {
                str = 1;
            }else{
                str = 2;
            }
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI,
                type: "put",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    workModel: str
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            var objData = that.state.data;

                            if (str === 0){
                                objData.workModel = "紧急模式:1分钟/次";
                            }else if(str === 1){
                                objData.workModel = "正常模式:10分钟/次";
                            }else{
                                objData.workModel = "省电模式:1小时/次";
                            }
                            that.setState({data:objData});
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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

    handleVolume: function () {
        var child =
                <div className="weui_cells weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">音量(0-6)</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <select className="weui_select" id="select">
                                <option value="0">0</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                        </div>
                    </div>
                </div>,
            title = "设置音量",
            that = this,
            dialog = that.refs.dialogCancel;
        that.setState({toastSuccess: "设置成功"});
        that.setState({dialogNode: child});
        that.setState({dialogTitle: title});


        dialog.show(function () {
            var ele = document.getElementById("select").value.trim();
            console.log(ele);
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI,
                type: "put",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    volume: ele
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);

                            var objData = that.state.data;
                            objData.volume = ele;
                            that.setState({data:objData});
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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

    handleTime: function () {
        var child =
                <div className="weui_cells" style={{fontSize:"1rem"}}>
                    <div className="weui_cell weui_cell_switch">
                        <div className="weui_cell_hd weui_cell_primary" style={{fontSize:"0.8rem"}}>时段1</div>
                        <div className="weui_cell_bd">
                            <input className="my_time" type="time"/>
                            <span> --- </span>
                            <input className="my_time" type="time"/>
                        </div>
                        <div className="weui_cell_ft">
                            <input className="weui_switch" type="checkbox" style={{width:"2.7rem"}}/>
                        </div>
                    </div>
                    <div className="weui_cell weui_cell_switch">
                        <div className="weui_cell_hd weui_cell_primary" style={{fontSize:"0.8rem"}}>时段2</div>
                        <div className="weui_cell_bd">
                            <input className="my_time" type="time"/>
                            <span> --- </span>
                            <input className="my_time" type="time"/>
                        </div>
                        <div className="weui_cell_ft">
                            <input className="weui_switch" type="checkbox" style={{width:"2.7rem"}}/>
                        </div>
                    </div>
                    <div className="weui_cell weui_cell_switch">
                        <div className="weui_cell_hd weui_cell_primary" style={{fontSize:"0.8rem"}}>时段3</div>
                        <div className="weui_cell_bd">
                            <input className="my_time" type="time"/>
                            <span> --- </span>
                            <input className="my_time" type="time"/>
                        </div>
                        <div className="weui_cell_ft">
                            <input className="weui_switch" type="checkbox" style={{width:"2.7rem"}}/>
                        </div>
                    </div>
                </div>,
            title = <div><p>免打扰</p><p style={{color:"red"}}>（只针对周一到周五有效）</p></div>,
            that = this,
            dialog = that.refs.dialogCancel;
        that.setState({toastSuccess: "设置成功"});
        that.setState({dialogTitle: title});

        that.setState({dialogNode: child}, function () {
            var ele = document.getElementsByClassName("my_time"),
                ele_switch = document.getElementsByClassName("weui_switch"),
                arr = that.state.data.forbiddenTime;

            for(var i=0; i<arr.length; i++){
                if(!(ele[i] === null)){
                    ele_switch.value = "on";
                }
                ele[2*i].value = arr[i][0];
                ele[2*i+1].value = arr[i][1];
            }

        });

        dialog.show(function () {
            var ele = document.getElementsByClassName("my_time"),
                ele_switch = document.getElementsByClassName("weui_switch"),
                str = '';
            for (var i = 0; i < ele_switch.length; i++) {
                console.log(ele[i].value);
                console.log(ele_switch[i].value);
                if (ele_switch[i].checked ) {
                    console.log(ele_switch[i].value);
                    var j = 2 * i;
                    str += ele[j].value + '-' +ele[j+1].value+ ',';
                }else{
                    str += null+',';
                }
            }

            str = str.substring(0,str.length-1);
            console.log(str);
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI,
                type: "put",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    forbiddenTime: str
                },
                success: function (data) {

                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);

                            var arr = str.split(","),forbiddenTime = [];
                            for (var i=0; i<arr.length;i++){
                                forbiddenTime.push(arr[i].split("-"));
                            }
                            var objData = that.state.data;
                            objData.forbiddenTime = forbiddenTime;

                            that.setState({data:objData});
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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


    forbiddenFlag: function () {
        var that = this,
        dialog = that.refs.dialogCancel;
        that.setState({dialogNode: "确定要关闭免打扰功能?"});
        that.setState({dialogTitle: "关闭免打扰"});
        that.setState({toastSuccess: "关闭成功"});

        dialog.show(function () {
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI,
                type: "put",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    forbiddenFlag: 0
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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
    shutDown: function () {
        var that = this,
            dialog = that.refs.dialogCancel;


        that.setState({dialogNode: "确定要远程关机?"});
        that.setState({dialogTitle: "远程关机"});
        that.setState({toastSuccess: "关闭成功"});

        dialog.show(function () {
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI + "/action/shutdown",
                type: "post",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    action: 0

                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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
    handleReset: function () {
        var that = this,
            dialog = that.refs.dialogCancel;


        that.setState({dialogNode: "确定要恢复默认模式?"});
        that.setState({dialogTitle: "恢复默认模式"});
        that.setState({toastSuccess: "设置成功"});

        dialog.show(function () {
            CreateXHR({
                url: "http://api.smartlocate.cn/v1/device/" + that.state.ajax.IMEI + "/action/shutdown",
                type: "post",
                data: {
                    username: that.state.ajax.username,
                    ticket: that.state.ajax.ticket,
                    action:1
                },
                success: function (data) {
                    switch (data.errcode) {
                        case 0:
                            that.refs.successToast.show();
                            setTimeout(function () {
                                that.refs.successToast.hide();
                            }, 2000);
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
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
        return (
            <div className="devicePage page">
                <div className="weui_cells weui_cells_access" style={{fontSize:"1rem"}}>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.handleNick}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FF70FA",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-nickname"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>修改昵称</p>
                        </div>
                        <div className="weui_cell_ft"><strong
                            style={{color: "#000"}}>{this.state.data.nick}</strong></div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.handleSOS}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#E21F22",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-sos"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>SOS号码</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.handleFamily}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#E21F22",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-dianhua"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>亲情号码</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="test.html#/user/phone">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#9A59E2",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-dianhuaben"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>电话本</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.handleModel}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#26FFC7",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-shujuguanlisvg93"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>工作模式</p>
                        </div>
                        <div className="weui_cell_ft"><strong
                            style={{color: "#000"}}>{this.state.data.workModel}</strong></div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.handleVolume}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#D7E2AA",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-6"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>设置音量</p>
                        </div>
                        <div className="weui_cell_ft"><strong style={{color: "#000"}}>{this.state.data.volume}</strong>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.handleTime}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#28A8E2",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-miandarao1"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>免打扰时段</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.forbiddenFlag}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#476AE2",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-miandarao"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>关闭免打扰</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.shutDown}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#E21363",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-guanji-copy"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>远程关机</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);" onClick={this.handleReset}>
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#26E22B",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-fanhui2-copy"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>恢复默认模式</p>
                        </div>
                        <div className="weui_cell_ft"></div>
                    </a>
                </div>
                <DialogCancel ref="dialogCancel" node={this.state.dialogNode} title={this.state.dialogTitle}/>
                <ToastSuccess ref="successToast" toast={this.state.toastSuccess}/>
            </div>
        )
    },
});

// export default Device;

module.exports  = Device;