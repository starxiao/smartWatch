/**
 * Created by user on 2016/9/29.
 */
import React from 'react';
import Cookie from './cookie';
import CreateXHR from './xhr';
import DialogCancel from './dialogCancel';
import ToastSuccess from './ToastSuccess';
var Find = React.createClass({
    getInitialState:function () {
        return {
            title:"寻找手表",
            toast:"发送成功"
        }
    },
    HandleSubmit:function(){
        var username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI"),
            that = this,
            dialog = that.refs.dialogCancel,
            toast = that.refs.toastSuccess;
        that.setState({title:"寻找手表"});
        dialog.show(function () {
            CreateXHR({
                url:"http://api.smartlocate.cn/v1/device/"+IMEI+"/action/find",
                type:"post",
                data:{
                    username:username,
                    ticket:ticket
                },
                success:function (data) {
                    switch (data.errcode){
                        case 0:
                            that.setState({toast:"发送成功"});
                            toast.show();
                            window.setTimeout(function () {
                                toast.hide();
                            },2000);
                            break;
                        case 44001:
                            hashHistory.push('/user/login');
                            break;
                        default:
                            break;
                    }
                },
                error:function (xhr) {
                    console.log(xhr.status +xhr.statusText);
                }
            });

        });

    },
    render:function () {

        return(
            <div>
                <img style={{margin:"30px"}} src="../app/src/image/clock.gif" />
                <p style={{margin:"30px"}}>随时随地知道手表的位置</p>
                <p style={{margin:"30px"}}>1.点击找手表按钮</p>
                <p style={{margin:"30px"}}>2.在弹框中点击确定</p>
                <p style={{margin:"30px"}}>3.指令发生成功</p>
                <p style={{margin:"30px"}}>4.设备接收指令后报警</p>
                <div className="weui_btn_area">
                    <a className="weui_btn weui_btn_primary" href="javascript:" onClick={this.HandleSubmit}>寻找手表</a>
                </div>
                <DialogCancel ref="dialogCancel" title={this.state.title}/>
                <ToastSuccess ref="toastSuccess" toast={this.state.toast}/>
            </div>
        )
    }
});

export default Find;