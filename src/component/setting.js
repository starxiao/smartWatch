/**
 * Created by user on 2016/9/8.
 */
import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';


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
                        hashHistory.push('/login');
                        break;
                    default:
                        hashHistory.push('/login');
                        break;
                }
            },
            error:function(xhr){
                console.log(xhr.status + xhr.statusText);
                hashHistory.push('/login');
            }

        })
    },
    render:function(){
        return(
            <div className="page settingPage">
                <div className="weui_cells weui_cells_access">
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe648;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>个人资料</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe648;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>宝贝资料</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="test.html#/deviceList">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe64b;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>设备列表</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="test.html#/userUpdated">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe63d;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>密码修改</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe626;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>意见建议</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe626;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>常见问题</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe626;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>关于</p>
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:void(0);">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{
                                color: "#D7E2AA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>&#xe626;</i>
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
                            <a href="test.html#/setting">
                                <i className="iconfont">&#xe6f4;</i>设备
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

export default Setting;