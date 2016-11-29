/**
 * Created by user on 2016/9/13.
 */

import React from 'react';

var DialogCancel = React.createClass({
    show: function (callback) {

        var dialog = this.refs.dialogCancel;
        dialog.style.display = "block";
        dialog.addEventListener('click', function func(event) {   // event.target 返回点击的DOM元素

            if (event.target.className.indexOf("MyDefault") > 0) {
                dialog.removeEventListener('click', func);
                dialog.style.display = "none";

            }
            if (event.target.className.indexOf("MyPrimary") > 0) {
                callback();
                dialog.removeEventListener('click', func);
                dialog.style.display = "none";
            }
        });

    },
    render: function () {
        return (
            <div className="weui_dialog_confirm" ref="dialogCancel" style={{display: "none"}}>
                <div className="weui_mask"></div>
                <div className="weui_dialog">
                    <div className="weui_dialog_hd">
                        <strong id="dialogTitle" className="weui_dialog_title">{this.props.title}</strong>
                    </div>
                    <div className="weui_dialog_bd">
                        {this.props.node}
                    </div>
                    <div className="weui_dialog_ft">
                        <a href="javascript:" className="weui_btn_dialog default MyDefault">取消</a>
                        <a href="javascript:" className="weui_btn_dialog primary MyPrimary">确定</a>
                    </div>
                </div>
            </div>
        )
    }
});

export default DialogCancel;