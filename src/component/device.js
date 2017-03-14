/**
 * Created by user on 2016/9/8.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';
import 'weui';
import '../styles/home.css';

var Setting = React.createClass({

    handleClick:function(){
        var username  = Cookie("username"),
            ticket = Cookie("ticket"),
            url = 'http://api.smartlocate.cn/v1/';
        CreateXHR({
            type:"POST",
            url:url + "user/"+username+"/logout",
            data:{
                ticket:ticket
            },
            success:function(data){
                switch (data.errcode) {
                    case 0:
                        Cookie("code",'');
                        Cookie("username",'');
                        Cookie("ticket",'');
                        hashHistory.push('/user/login');
                        break;
                    default:
                        hashHistory.push('/user/login');
                        break;
                }
            },
        })
    },
    render:function(){
        return(
            <div className="page settingPage">
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="build.html#/user/profile">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#E24736",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-msnui-user-info"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>个人资料</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="build.html#/device/list">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#2A84E2",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-shoubiao"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>设备列表</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="build.html#/user/update">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#E2BE2E",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-mima"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>密码修改</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#E258E1",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-changjianwenti"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>常见问题</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#39E269",
                                marginRight: "10px",
                                marginTop: "3px"}}>
                                <use xlinkHref="#icon-bangzhu"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>帮助</p>
                        </div>
                    </a>
                    <div className="weui_btn_area">
                        <a className="weui_btn weui_btn_warn" href="javascript:void(0);" onClick={this.handleClick}>
                            退出登录
                        </a>
                    </div>
                </div>
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

// export default Setting;

module.exports = Setting;