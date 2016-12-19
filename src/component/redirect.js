/**
 * Created by user on 2016/8/22.
 */

import React from 'react';
import Cookie from './cookie';
import RegexpUrl from './regexpUrl';



var Redirect = React.createClass({

    render:function () {
        var url = window.location.href;
        var temp = RegexpUrl(url, 'isLogined');

        if (temp === 'true') {
            var username = RegexpUrl(url, 'username'),
                ticket = RegexpUrl(url, 'ticket');
            Cookie('username', username);
            Cookie('ticket', ticket);
            window.location.href = "http://app.smartlocate.cn/build/test.html";
        } else {
            var code = RegexpUrl(url, 'code');
            Cookie('code', code);
            window.location.href = "http://app.smartlocate.cn/build/test.html#/user/login";
        }
        return null;
    }

});


// export default Redirect;


module.exports = Redirect;