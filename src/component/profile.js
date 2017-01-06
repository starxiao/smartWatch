/**
 * Created by user on 2016/12/23.
 */
import React from 'react';
import CreateXHR from './xhr';
import ToastError from './ToastError';
import ToastSuccess from './ToastSuccess';
import 'weui';
var Profile = React.createClass({
    getInitialState: function () {
        return {
            toast:''
        }
    },
    componentWillMount:function () {

    },
    handleSubmit:function () {
        var that = this;
        var profileVal = that.refs.profileVal.value,
            nameVal = that.refs.nameVal.value,
            phoneVal = that.refs.phoneVal.value;
        var sexVal = '';
        if(that.refs.boy.checked){
            sexVal = '男';
        }
        if(that.refs.girl.checked){
            sexVal = '女';
        }
        if(!profileVal){
            that.setState({toast:'帐号未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else if(!sexVal){
            that.setState({toast:'性别未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else if (!nameVal){
            that.setState({toast:'姓名未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else if (!phoneVal){
            that.setState({toast:'电话未填写'});
            that.refs.ToastError.show();
            window.setTimeout(function () {
                that.refs.ToastError.hide();
            },1000);
        }else{
            that.setState({toast:'保存成功'});
            that.refs.ToastSuccess.show();
            window.setTimeout(function () {
                that.refs.ToastSuccess.hide();
            },1000);
        }

    },
    render: function () {
        return (
            <div className="page ProfilePage">
                <div className="weui_cells weui_cells_form">
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FF70FA",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-zhanghao"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">账号</div>
                        <div>
                            <input ref="profileVal" className="weui_input" type="text" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#DCFF71",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-xingbie"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">性别</div>
                        <div style={{marginLeft:"5rem"}}>
                            <label className="weui_check_label">男
                                <input ref="boy" type="radio" name="radio" value="男" id="radio1" style={{margin:"0 10px"}}/>
                            </label>
                            <label className="weui_check_label">女
                                <input ref="girl" type="radio" name="radio" value="女" id="radio2" style={{margin:"0 10px"}}/>
                            </label>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#81FFC4",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-xingming"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">姓名</div>
                        <div>
                            <input ref="nameVal" className="weui_input" type="text" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FFE96E",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-dianhua"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">电话</div>
                        <div>
                            <input ref="phoneVal" className="weui_input" type="number" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                </div>
                <div className="weui_btn_area">
                    <a className="weui_btn weui_btn_primary" href="javascript:;" onClick={this.handleSubmit}>保存</a>
                </div>
                <ToastError ref="ToastError" toast={this.state.toast}/>
                <ToastSuccess ref="ToastSuccess" toast={this.state.toast}/>
            </div>
        )
    }
});

module.exports = Profile;