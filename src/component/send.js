/**
 * Created by user on 2016/11/30.
 */

import CreateXHR from './xhr';

function Send() {

    console.log('this is send');

    CreateXHR({
        url:"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential+" +
        "&appid=APPID&secret=APPSECRET",
        type:"GET",
        success:function (res) {
            console.log(res);
        },
        error:function (xhr) {
            console.log(xhr.status + xhr.statusText);
        }
    })
}

export default Send;