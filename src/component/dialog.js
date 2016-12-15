/**
 * Created by user on 2016/8/10.
 */
import React from 'react';
import 'weui';


var Dialog = React.createClass({
    show:function () {
        var dialog = this.refs.dialog;
        dialog.style.display = "block";
        dialog.addEventListener('click',function func(){
            dialog.removeEventListener('click',func);
            dialog.style.display = "none";
        });
    },
    render: function () {
        return (
            <div className="weui_dialog_alert" ref="dialog" style={{display: "none"}}>
                <div className="weui_mask"></div>
                <div className="weui_dialog">
                    <div className="weui_dialog_hd">
                        <div className="weui_dialog_title">
                            <strong className="weui_strong">{this.props.title}</strong>
                        </div>
                    </div>
                    <div className="weui_dialog_ft">
                        <a href="javascript:void(0);" className="weui_btn_dialog primary">{this.props.content}</a>
                    </div>
                </div>
            </div>
        )
    }
});

export default Dialog;