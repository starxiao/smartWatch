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
            ticket = Cookie("ticket");
        CreateXHR({
            type:"POST",
            url:"http://api.smartlocate.cn/v1/user/"+username+"/logout",
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
                        break;
                }
            },
            error:function(xhr){
                console.log(xhr.status + xhr.statusText);
            }

        })
    },
    render:function(){
        return(
            <div className="container">
                <div className="weui_cells weui_cells_access" style={{marginTop:'0px'}}>
                    <a className="weui_cell" href="javascript:;">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#FF70FA",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe648;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>个人资料</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:;">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#E279C9",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe648;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>宝贝资料</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                    <a className="weui_cell" href="build.html#/deviceList">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#48E28B",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe64b;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>设备列表</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                    <a className="weui_cell" href="build.html#/userUpdated">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#A0E22F",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe63d;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>密码修改</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:;">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#476AE2",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe626;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>意见建议</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:;">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#476AE2",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe626;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>常见问题</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:;">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#476AE2",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe626;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>关于</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                    <a className="weui_cell" href="javascript:;">
                        <div className="weui_cell_hd">
                            <i className="iconfont" style={{color:"#476AE2",width: "20px", marginRight: "10px", marginTop: "3px"}}>&#xe626;</i>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <p>帮助</p>
                        </div>
                        <div className="weui_cell_ft">
                        </div>
                    </a>
                </div>
                <a href="javascript:" className="weui_btn weui_btn_primary" style={{margin:'20px 10px',backgroundColor:'#4B7EE2'}} onClick={this.handleClick}>退出登录</a>
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

export default Setting;