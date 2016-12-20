/**
 * Created by user on 2016/8/10.
 */

import React from 'react';
import 'weui';
// import '../image/iconfont/iconfont.css';


var ToastError = React.createClass({
    show:function () {
        this.refs.toast.style.display = "block";
    },
    hide:function () {
        this.refs.toast.style.display = "none";
    },
    render: function () {
        return(
            <div ref="toast" style={{display:"none"}}>
                <div className="weui_mask_transparent"></div>
                <div className="weui_toast">
                    <svg className="iconfont" aria-hidden="true" style={{color:"#E21108",width:"5rem",height:"5rem"}}>
                        <use xlinkHref="#icon-jinggao"/>
                    </svg>
                    <p className="weui_toast_content">{this.props.toast}</p>
                </div>
            </div>
        )
    }
});

export default ToastError;
