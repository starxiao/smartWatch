/**
 * Created by user on 2016/8/19.
 * @return {string}
 */


function RegexpUrl(str,name){

    var flag = new RegExp("(^|&)"+name+"=([^&|\\?]*)(&|$|\\?)",'g');
    var myString = String(str.match(flag));

    if(name === "ticket") {
        if (myString.indexOf("?") > 0) {
            return myString.slice((name.length + 2), (myString.length - 1));
        } else {
            return myString.slice((name.length + 2), (myString.length));
        }
    }

    return myString.slice((name.length+2),(myString.length-1));

}
export default RegexpUrl;