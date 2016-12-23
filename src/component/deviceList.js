/**
 * Created by user on 2016/9/9.
 */

import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';
import 'weui';
import '../styles/home.css';


var url = 'http://api.smartlocate.cn/v1/',
    username = Cookie('username'),
    ticket = Cookie('ticket');

var DeviceList = React.createClass({
    getInitialState: function () {
        return {dataList: []}
    },
    getMsg: function () {
        var that = this;
        CreateXHR({
            type: "GET",
            url: url + "device?username=" + username + "&ticket=" + ticket,
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({dataList:data.data});
                        break;
                    default:
                        hashHistory.push('/user/login');
                        break;
                }

            },
            complete:function () {
                var IMEI = Cookie("IMEI");
                var node = document.getElementsByClassName("IMEI");
                for (var i=0; i< node.length; i++){
                    if (node[i].innerText.indexOf(IMEI) > 0){
                        node[i].parentElement.style.backgroundColor = "green";
                    }
                }
            },
        });
    },
    componentDidMount: function () {
        this.getMsg();
    },
    handleMsg: function () {

        return this.state.dataList.map(function (data, index) {
            return (
                <div className="ListCell weui_cells weui_cells_access" style={{marginTop: '0px'}} key={index}>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{color:"#48E28B",width: "20px", marginRight: "10px", marginTop: "3px"}}>
                                <use xlinkHref="#icon-shoubiao"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>当前</p>
                        </div>
                        <div className="IMEI weui_cell_footer">
                            {data.nick + '(' + data.IMEI + ')'}
                        </div>
                    </a>
                </div>
            )
        })
    },
    render: function () {
        return (
            <div className="page listPage">
                {
                    this.handleMsg()
                }
                <a href="build.html#/device/add" className="add_btn btn" style={{color: "black"}}>
                    添加设备
                </a>
                <a href="build.html#/device/change" className="change_btn btn" style={{color: "black"}}>
                    切换设备
                </a>
                <a href="build.html#/device/delete" className="delete_btn btn" style={{color: "black"}}>
                    删除设备
                </a>
                <div className="footer">
                    <ul>
                        <li style={{backgroundColor: "#34AAB7"}}>
                            <a href="#">
                                <svg className="iconfont" aria-hidden="true">
                                    <use xlinkHref="#icon-iconfont13"/>
                                </svg>主页
                            </a>
                        </li>
                        <li style={{backgroundColor: "#54CC76"}}>
                            <a href="build.html#/device">
                                <svg className="iconfont" aria-hidden="true">
                                    <use xlinkHref="#icon-yonghu1"/>
                                </svg>我的
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
});


// export default DeviceList;

module.exports = DeviceList;