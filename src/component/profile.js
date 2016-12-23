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
        that.setState({toast:'保存成功'});
        that.refs.ToastSuccess.show();
        window.setTimeout(function () {
            that.refs.ToastSuccess.hide();
        },2000);
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
                                <use xlinkHref="#icon-nickname"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">帐号</div>
                        <div>
                            <input className="weui_input" type="text" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FF70FA",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-nickname"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">性别</div>
                        <div style={{marginLeft:"50px"}}>
                            <label className="weui_check_label" style={{marginRight:"10px"}}>男</label>
                            <input type="radio"  name="radio1" style={{marginRight:"10px"}}/>
                            <label className="weui_check_label" style={{marginRight:"10px"}}>女</label>
                            <input type="radio"  name="radio2"/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FF70FA",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-nickname"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">姓名</div>
                        <div>
                            <input className="weui_input" type="text" style={{marginLeft:"10px"}}/>
                        </div>
                    </div>
                    <div className="weui_cell">
                        <div className="weui_cell_hd">
                            <svg className="iconfont" aria-hidden="true" style={{
                                color: "#FF70FA",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}>
                                <use xlinkHref="#icon-nickname"/>
                            </svg>
                        </div>
                        <div className="weui_cell_bd">电话</div>
                        <div>
                            <input className="weui_input" type="text" style={{marginLeft:"10px"}}/>
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