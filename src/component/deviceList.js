/**
 * Created by user on 2016/9/9.
 */

import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';

var DeviceList = React.createClass({
    getInitialState: function () {
        return {dataList: []}
    },
    getMsg: function () {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket");
        CreateXHR({
            type: "GET",
            url: "http://api.smartlocate.cn/v1/device?username=" + username + "&ticket=" + ticket,
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        that.setState({dataList:data.data});
                        break;
                    case 44001:
                        hashHistory.push('/login');
                        break;
                    default:
                        break;
                }

            },
            complete:function () {
                var IMEI = Cookie("IMEI");
                var node = document.getElementsByClassName("IMEI");
                //console.log(node[0].parentNode);
                for (var i=0; i< node.length; i++){
                    if (node[i].innerText.indexOf(IMEI) > 0){
                        node[i].parentElement.style.backgroundColor = "green";
                    }
                }
            },
            error: function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }
        });
    },
    componentDidMount: function () {
        this.getMsg();

    },
    handleMsg: function () {
        var that = this;
        return this.state.dataList.map(function (data, index) {
            return (
                <div className="ListCell weui_cells weui_cells_access" style={{marginTop: '0px'}} key={index}>
                    <a className="weui_cell" href="javascript:;">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#48E28B",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe64b;</i>
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
                <a href="build.html#/deviceAdd" className="add_btn btn" style={{color: "black"}}>
                    添加设备
                </a>
                <a href="build.html#/deviceChange" className="change_btn btn" style={{color: "black"}}>
                    切换设备
                </a>
                <a href="build.html#/deviceDelete" className="delete_btn btn" style={{color: "black"}}>
                    删除设备
                </a>
                <div className="footer">
                    <ul>
                        <li style={{backgroundColor: "#34AAB7"}}>
                            <a href="build.html#/setting">
                                <i className="iconfont">&#xe6f4;</i>关于我
                            </a>
                        </li>
                        <li style={{backgroundColor: "#54CC76"}}>
                            <a href="#">
                                <i className="iconfont">&#x3478;</i>主页
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
});


export default DeviceList;