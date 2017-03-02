/**
 * Created by xxx on 2017/2/20.
 */


import React from 'react';
import Cookie from './cookie';

var ChatRedirect = React.createClass({

    render:function () {
        var url = window.location.href;
        console.log(url);
        var reg = new RegExp("&IMEI=");
        var IMEI = url.slice(reg.exec(url).index+6,url.length);
        console.log(IMEI);
        Cookie('IMEI',IMEI);
        window.location.href = "http://app.smartlocate.cn/build/build.html#/user/chat";
        return null;
    }

});

// export default Redirect;


module.exports = ChatRedirect;