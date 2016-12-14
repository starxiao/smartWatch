/**
 * Created by user on 2016/8/15.
 */
import React from 'react';
import CreateXHR from './xhr';
import Cookie from './cookie';
import ToastSuccess from './ToastSuccess';

var DialogConfirm = React.createClass({
    putData: function (e) {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI"),
            data = e.data;

        CreateXHR({
            url: "http://api.smartlocate.cn/v1/device/" + IMEI,
            type: "put",
            data: data,
            success: function (data) {
                if (data.errcode === 0) {
                    that.refs.ToastOk.show();
                    setTimeout(function () {
                        that.refs.ToastOk.hide();
                    }, 2000);
                }
            },
            error: function (xhr) {
                console.error(xhr.status + xhr.statusText);
            }
        });
    },
    show: function () {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            dialog = that.refs.dialogConfirm;
        dialog.style.display = "block";
        dialog.addEventListener('click', function func(event) {   // event.target 返回点击的DOM元素

            if (event.target.className.indexOf("default") > 0) {
                dialog.removeEventListener('click', func);
                dialog.style.display = "none";

            }
            if (event.target.className.indexOf("primary") > 0) {


                var inputValue = [], data = {}, str = '';
                var title = document.getElementById("dialogTitle").innerText;
                var element = document.getElementsByClassName("phone");


                for (var j = 0; j < element.length; j++) {
                    inputValue.push(element[j].value.trim());
                    element[j].value = null;
                }
                if (inputValue[0] === '') {
                    return null;
                }

                for (var i = 0; i < inputValue.length; i++) {

                    str += inputValue[i] + ',';    // 在数据后面加逗号隔开

                }

                str = str.substring(0, str.length - 1);   // 删除最后一个数据的逗号

                switch (title) {
                    case "修改昵称":
                        data = {username:username,ticket:ticket,nick: str};
                        break;
                    case "监控号码":
                        data = {username: username, ticket: ticket, emergencyPhone: str};
                        break;
                    case "亲情号码":
                        data = {username: username, ticket: ticket, familyPhone: str};
                        break;
                    case "工作模式":
                        if (element[0].checked) {
                            data = {username: username, ticket: ticket, workModel: 0};
                        } else {
                            data = {username: username, ticket: ticket, workModel: 1};
                        }
                        break;
                    case "设置音量":
                        if (Number(str) < 0 || Number(str) > 6) {
                            return null;
                        }
                        data = {username: username, ticket: ticket, volume: str};
                        break;
                    case "免打扰":
                        data = {username:username, ticket:ticket,forbiddenFlag:1,forbiddenTime:str};
                        break;
                    default:
                        break;
                }

                dialog.removeEventListener('click', func);
                dialog.style.display = "none";
                that.putData({data});
            }
        });

    },
    render: function () {
        return (
            <div className="weui_dialog_confirm" ref="dialogConfirm" style={{display: "none"}}>
                <div className="weui_mask"></div>
                <div className="weui_dialog">
                    <div className="weui_dialog_hd"><strong id="dialogTitle" className="weui_dialog_title">{this.props.title}</strong>
                    </div>
                    <div className="weui_dialog_bd">
                        {this.props.node}
                    </div>
                    <div className="weui_dialog_ft">
                        <a href="javascript:void(0);" className="weui_btn_dialog default">取消</a>
                        <a href="javascript:void(0);" className="weui_btn_dialog primary">确定</a>
                    </div>
                </div>
                <ToastSuccess ref="ToastOk" toast="更改成功"/>
            </div>
        )
    }
});

export default DialogConfirm;