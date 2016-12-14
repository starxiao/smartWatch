/**
 * Created by user on 2016/8/10.
 */
import React from 'react';


var ToastSuccess = React.createClass({
    show:function () {
        this.refs.toastSuccess.style.display = "block";
    },
    hide:function () {
        this.refs.toastSuccess.style.display = "none";
    },
    render: function () {
        return(
            <div ref="toastSuccess" style={{display:"none"}}>
                <div className="weui_mask_transparent"></div>
                <div className="weui_toast">
                    <i className="weui_icon_toast"/>
                    <p className="weui_toast_content">{this.props.toast}</p>
                </div>
            </div>
        )
    }
});

export default ToastSuccess;