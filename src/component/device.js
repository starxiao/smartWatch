/**
 * Created by user on 2016/9/8.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';
import 'weui';
import '../styles/home.css'

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
                        hashHistory.push('/login');
                        Cookie("username",'');
                        Cookie("ticket",'');
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        hashHistory.push('/user/login');
                        break;
                }
            },
            error:function(xhr){
                console.log(xhr.status + xhr.statusText);
                hashHistory.push('/user/login');
            }

        })
    },
    render:function(){
        return(
            <div className="page settingPage">
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont icon-msnui-user-info" style={{
                                color: "#E24736",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>个人资料</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="test.html#/device/list">
                        <div className="weui_cell_hd">
                            <i className="iconfont icon-shoubiao" style={{
                                color: "#2A84E2",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>设备列表</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="test.html#/user/update">
                        <div className="weui_cell_hd">
                            <i className="iconfont icon-mima" style={{
                                color: "#E2BE2E",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>密码修改</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont icon-jianyi" style={{
                                color: "#36E2B9",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>意见建议</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont icon-changjianwenti" style={{
                                color: "#E258E1",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>常见问题</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont icon-guanyu" style={{
                                color: "#8333E2",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>关于</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont icon-bangzhu" style={{
                                color: "#39E269",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
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
                                <i className="iconfont icon-iconfont13"/>主页
                            </a>
                        </li>
                        <li style={{backgroundColor: "#54CC76"}}>
                            <a href="test.html#/device">
                                <i className="iconfont icon-yonghu1"/>我的
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