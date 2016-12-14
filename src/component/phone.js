/**
 * Created by user on 2016/9/13.
 */


import React from 'react';
import {hashHistory} from 'react-router';
import CreateXHR from './xhr';
import Cookie from './cookie';
import ToastSuccess from './ToastSuccess';


var Phone = React.createClass({

    componentDidMount:function () {

        var username = Cookie("username"), ticket = Cookie("ticket"), IMEI = Cookie("IMEI");
        CreateXHR({
            url: "http://api.smartlocate.cn/v1/device/" + IMEI + "?username=" + username + "&ticket=" + ticket,
            type:"get",
            success:function (data) {
                switch (data.errcode) {
                    case 0:
                        console.log(data.data);
                        var telephoneBook = data.data.telephoneBook.split(","),
                            ele = document.getElementsByClassName("phone");
                        for(var i=0; i<ele.length; i++){
                            if(!telephoneBook[i]){
                                telephoneBook[i] = '';
                            }
                            ele[i].value = telephoneBook[i];
                        }
                        break;
                    case 44001:
                        hashHistory.push('/user/login');
                        break;
                    default:
                        break;
                }
            },
            error:function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }
        });

    },
    HandleSubmit:function(){

        var username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");

        var str = '',
            element = document.getElementsByClassName("phone"),
            toast = this.refs.ToastSuccess;
        for (var i=0; i<element.length; i++){
            if (element[i].value === ''){
                continue;
            }
            str += element[i].value.trim()+',';
        }
        str = str.substring(0,str.length-1);
        CreateXHR({
            url: "http://api.smartlocate.cn/v1/device/" + IMEI,
            type: "put",
            data: {
                username:username,
                ticket:ticket,
                telephoneBook:str
            },
            success: function (data) {
                switch (data.errcode) {
                    case 0:
                        toast.show();
                        setTimeout(function () {
                            toast.hide();
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

    },
    render: function () {
        return (
            <div className="PhonePage page">
                <div className="weui_cells weui_cells_access">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">姓名1</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
                        </div>
                    </div>
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
                            <label className="weui_label">姓名2</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
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
                            <label className="weui_label">姓名3</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
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
                            <label className="weui_label">姓名4</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
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
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">姓名5</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码5</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">姓名6</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码6</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">姓名7</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码7</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">姓名8</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码8</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">姓名9</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码9</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">姓名10</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" placeholder="请输入名字"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <label className="weui_label">号码10</label>
                        </div>
                        <div className="weui_cell_bd weui_cell_primary">
                            <input className="phone weui_input" type="number" pattern="[0-9]*" placeholder="请输入手机号码"/>
                        </div>
                    </div>
                </div>
                <div className="weui_btn_area">
                    <a className="weui_btn weui_btn_primary" href="javascript:" onClick={this.HandleSubmit}>保存</a>
                </div>
                <ToastSuccess ref = "ToastSuccess" toast="保存成功"/>
            </div>
        )
    }


});


export default Phone;