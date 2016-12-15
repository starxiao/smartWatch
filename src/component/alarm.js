/**
 * Created by user on 2016/9/29.
 */

import React from 'react';
import {hashHistory} from 'react-router';
import Cookie from './cookie';
import CreateXHR from './xhr';
import DialogCancel from './dialogCancel';
import ToastError from './ToastError';
import ToastSuccess from './ToastSuccess';
import 'weui';

var Alarm = React.createClass({
    getInitialState: function () {
        return {
            title:"",
            toast:""
        }

    },
    componentWillMount:function () {
        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");
        CreateXHR({
            url: "http://api.smartlocate.cn/v1/device/"+ IMEI + "?username=" +username + "&ticket=" +ticket,
            type: "get",
            success:function (data) {
                switch (data.errcode) {
                    case 0:
                        console.log(data);
                        var ele = document.getElementsByClassName("checkbox"),
                            eleTime = document.getElementsByClassName("setTime"),
                            eleWeek = document.getElementsByClassName("setWeek"),
                            arr = data.data.alarm.split("@"),str=[],myArr = [];

                        for(var i=0; i< arr.length; i++){
                            str = arr[i].split(",");
                            var myStr = '';
                            if (str[0] === "1"){
                                ele[i].checked = true;
                            }
                            eleTime[i].innerText = str[1];
                            myArr = str[2].split('');
                            for (var j=0; j<myArr.length; j++){

                                switch(Number(myArr[j])){
                                    case 0: myStr += '日';
                                        break;
                                    case 1: myStr += '一';
                                        break;
                                    case 2: myStr += '二';
                                        break;
                                    case 3: myStr += '三';
                                        break;
                                    case 4: myStr += '四';
                                        break;
                                    case 5: myStr += '五';
                                        break;
                                    case 6: myStr += '六';
                                        break;
                                    default:
                                        break;
                                }
                            }
                            eleWeek[i].innerText = myStr;
                        }
                        break;
                    case 44001:
                        console.log("is error");
                        hashHistory.push('/user/login');
                        break;
                    default:
                        break;
                }

            },
            error:function (xhr) {
                console.log(xhr.status + xhr.statusText);
            }

        })
    },
    componentDidMount: function () {

        var that = this,
            username = Cookie("username"),
            ticket = Cookie("ticket"),
            IMEI = Cookie("IMEI");

        var ele = document.getElementsByClassName("alarm"),
            timeNode = document.getElementsByClassName("time"),
            checkWeekNode = document.getElementsByClassName("checkWeek"),
            workModel = document.getElementsByClassName("workModel"),
            showWeekNode = document.getElementsByClassName("showWeek"),
            weekNode = document.getElementsByClassName("week");

        for (var i = 0; i < ele.length; i++) {

            ele[i].addEventListener('click', (function (i) {               //监听设置闹铃时间下拉事件
                return function (e) {
                    console.log(e);
                    e.stopPropagation();  // 阻止冒泡或捕获
                    if(timeNode[i].style.display === "none"){
                        timeNode[i].style.display = "block";
                    }else{
                        timeNode[i].style.display = "none";
                    }
                    console.log(i);
                }
            })(i));
        }
        for (var k = 0; k < checkWeekNode.length; k++) {          //监听自定义选择事件

           // console.log(checkWeekNode);

            checkWeekNode[k].addEventListener('change', (function (k) {       //监听整个 radio change 事件
                return function (e) {
                    e.stopPropagation();           // 阻止冒泡或捕获
                    if (workModel[2*k].checked){                 //判断哪个radio被选择
                        showWeekNode[k].style.visibility = "hidden";
                    }else{
                        showWeekNode[k].style.visibility = "visible";
                    }
                    console.log(k);
                }
            })(k));
        }
        for (var j = 0; j < weekNode.length; j++) {                   //监听日期被点击事件

            weekNode[j].addEventListener('click', (function (j) {
                return function (e) {
                    e.stopPropagation();                // 阻止冒泡或捕获
                    if(!(weekNode[j].style.backgroundColor)){             //设置点击后背景颜色
                        weekNode[j].style.backgroundColor = "#53E9FF";
                    }else{
                        weekNode[j].style.backgroundColor = "";
                    }
                    console.log(j);
                }
            })(j));
        }

    },
    HandleSubmit: function () {

        var username = Cookie("username"),
            ticket =Cookie("ticket"),
            IMEI = Cookie("IMEI"),
            that = this,
            dialog = that.refs.dialogCancel;
        that.setState({title:"确定设置闹铃?"});
        dialog.show(function () {
            var ele = document.getElementsByClassName("checkbox"),
                eleTime = document.getElementsByClassName("setTime"),
                eleWeek = document.getElementsByClassName("setWeek"),
                workModel = document.getElementsByClassName("workModel"),
                myTime = document.getElementsByClassName("my_time"),
                weekNode = document.getElementsByClassName("week"),
                str = '',flag='';

            for (var i=0; i<ele.length; i++){
                if (ele[i].checked) {

                    if (workModel[2*i].checked){
                        str += '1,'+myTime[i].value.trim()+',0123456@';
                        console.log(str);
                    }else if (workModel[2*i+1].checked){
                        flag = '';                                //要每次循环的时候至空
                        for (var j=0; j<7; j++){
                            if (weekNode[6*i+i+j].style.backgroundColor){   //次数从0-6 7-13 所以是6*i+j+i
                                flag += j;
                            }
                        }
                        str += '1,'+myTime[i].value.trim()+','+flag+'@';
                        console.log(str);
                    }else{

                        var myArr = eleWeek[i].innerText,myStr='',time='';

                        for (var k=0; k<myArr.length; k++){
                            switch(myArr[k]){
                                case '日': myStr += '0';
                                    break;
                                case '一': myStr += '1';
                                    break;
                                case '二': myStr += '2';
                                    break;
                                case '三': myStr += '3';
                                    break;
                                case '四': myStr += '4';
                                    break;
                                case '五': myStr += '5';
                                    break;
                                case '六': myStr += '6';
                                    break;
                                default:
                                    break;
                            }
                        }
                        if (myTime[i].value.trim() === ''){
                            time = eleTime[i].innerText;
                        }else{
                            time = myTime[i].value.trim();
                        }
                        str += '1,'+time +','+myStr+'@';
                    }

                }else{
                    str += '0,' +'00:00'+',0123456@'
                }
            }
            str = str.substring(0,str.length-1);

            console.log(str);

            if (!str){                                            //判断是否有闹铃被设置
                that.setState({toast:"未打开按钮"});
                that.refs.toastError.show();
                window.setTimeout(function () {
                    that.refs.toastError.hide();
                },2000);

            }else {
                CreateXHR({
                    url: "http://api.smartlocate.cn/v1/device/" + IMEI,
                    type: "put",
                    data: {
                        username: username,
                        ticket: ticket,
                        alarm: str
                    },
                    success: function (data) {
                        switch (data.errcode) {
                            case 0:
                                that.setState({toast: "设置成功"});
                                that.refs.toastSuccess.show();
                                window.setTimeout(function () {
                                    that.refs.toastSuccess.hide();
                                }, 2000);
                                break;
                            case 44001:
                                hashHistory.push('/user/login');
                                break;
                            default:
                                break;
                        }
                    },
                    error: function (xhr) {
                        console.error(xhr.status + xhr.statusText);
                    }
                });
            }
        });
    },

    render: function () {
        return (
            <div className="alarmPage page">
                <div className="weui_cells">
                    <div className="weui_cell weui_cell_switch">
                        <div className="weui_cell_hd" style={{fontSize: "0.8rem"}}>
                            <i className="iconfont icon-paidui" style={{
                                color: "#FF70FA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="alarm weui_cell_bd weui_cell_primary">
                            <p>闹铃1</p>
                            <strong className="setTime">00:00</strong>
                            <p className="setWeek">一次</p>
                        </div>
                        <div className="weui_cell_ft">
                            <input className="checkbox weui_switch" type="checkbox" style={{width: "2.7rem"}}/>
                        </div>
                    </div>
                    <form className="time weui_cell_form" style={{display:"none"}}>
                        <div className="weui_cells">
                            <div className="weui_cell">
                                <div className="weui_cell_hd weui_cell_primary">设置时间</div>
                                <div className="weui_cell_bd weui_cell_primary">
                                    <input className="my_time" type="time"/>
                                </div>
                                <div className="weui_cell_ft"></div>
                            </div>
                        </div>
                        <div className="checkWeek weui_cells weui_cells_radio">
                            <label className="weui_cell weui_check_label">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <p>每天</p>
                                </div>
                                <div className="weui_cell_ft">
                                    <input type="radio" className="workModel weui_check" name="radio1" id="x11"
                                           value="1"/>
                                    <span className="weui_icon_checked"/>
                                </div>
                            </label>
                            <label className="weui_cell weui_check_label">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <p>自定义</p>
                                </div>
                                <div className="weui_cell_ft">
                                    <input type="radio" className="workModel weui_check" name="radio1" id="x10"
                                           value="0"/>
                                    <span className="weui_icon_checked"/>
                                </div>
                            </label>
                        </div>
                        <div className="showWeek weui_cell" style={{display:"flex",visibility:"hidden",justifyContent:"space-around"}}>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>日</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>一</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>二</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>三</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>四</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>五</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>六</span>
                        </div>
                    </form>
                    <div className="weui_cell weui_cell_switch">
                        <div className="weui_cell_hd" style={{fontSize: "0.8rem"}}>
                            <i className="iconfont icon-paidui" style={{
                                color: "#FF70FA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="alarm weui_cell_bd weui_cell_primary">
                            <p>闹铃2</p>
                            <strong className="setTime">00:00</strong>
                            <p className="setWeek">一次</p>
                        </div>
                        <div className="weui_cell_ft">
                            <input className="checkbox weui_switch" type="checkbox" style={{width: "2.7rem"}}/>
                        </div>
                    </div>
                    <form className="time weui_cell_form" style={{display:"none"}}>
                        <div className="weui_cells">
                            <div className="weui_cell">
                                <div className="weui_cell_hd weui_cell_primary">设置时间</div>
                                <div className="weui_cell_bd weui_cell_primary">
                                    <input className="my_time" type="time"/>
                                </div>
                                <div className="weui_cell_ft"></div>
                            </div>
                        </div>
                        <div className="weui_cells weui_cells_radio">
                            <label className="weui_cell weui_check_label">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <p>每天</p>
                                </div>
                                <div className="weui_cell_ft">
                                    <input type="radio" className="workModel weui_check" name="radio1" id="x12"
                                           value="2"/>
                                    <span className="weui_icon_checked"/>
                                </div>
                            </label>
                            <label className="checkWeek weui_cell weui_check_label">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <p>自定义</p>
                                </div>
                                <div className="weui_cell_ft">
                                    <input type="radio" className="workModel weui_check" name="radio1" id="x13"
                                           value="3"/>
                                    <span className="weui_icon_checked"/>
                                </div>
                            </label>
                        </div>
                        <div className="showWeek weui_cell" style={{display:"flex",visibility:"hidden",justifyContent:"space-around"}}>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>日</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>一</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>二</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>三</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>四</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>五</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>六</span>
                        </div>
                    </form>
                    <div className="weui_cell weui_cell_switch">
                        <div className="weui_cell_hd" style={{fontSize: "0.8rem"}}>
                            <i className="iconfont icon-paidui" style={{
                                color: "#FF70FA",
                                width: "20px",
                                marginRight: "10px",
                                marginTop: "3px"
                            }}/>
                        </div>
                        <div className="alarm weui_cell_bd weui_cell_primary">
                            <p>闹铃3</p>
                            <strong className="setTime">00:00</strong>
                            <p className="setWeek">一次</p>
                        </div>
                        <div className="weui_cell_ft">
                            <input className="checkbox weui_switch" type="checkbox" style={{width: "2.7rem"}}/>
                        </div>
                    </div>
                    <form className="time weui_cell_form" style={{display:"none"}}>
                        <div className="weui_cells">
                            <div className="weui_cell">
                                <div className="weui_cell_hd weui_cell_primary">设置时间</div>
                                <div className="weui_cell_bd weui_cell_primary">
                                    <input className="my_time" type="time"/>
                                </div>
                                <div className="weui_cell_ft"></div>
                            </div>
                        </div>
                        <div className="weui_cells weui_cells_radio">
                            <label className="weui_cell weui_check_label">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <p>每天</p>
                                </div>
                                <div className="weui_cell_ft">
                                    <input type="radio" className="workModel weui_check" name="radio1" id="x14"
                                           value="4"/>
                                    <span className="weui_icon_checked"/>
                                </div>
                            </label>
                            <label className="checkWeek weui_cell weui_check_label">
                                <div className="weui_cell_bd weui_cell_primary">
                                    <p>自定义</p>
                                </div>
                                <div className="weui_cell_ft">
                                    <input type="radio" className="workModel weui_check" name="radio1" id="x15"
                                           value="5"/>
                                    <span className="weui_icon_checked"/>
                                </div>
                            </label>
                        </div>
                        <div className="showWeek weui_cell" style={{display:"flex",visibility:"hidden",justifyContent:"space-around"}}>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>日</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>一</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>二</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>三</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>四</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>五</span>
                            <span className="week" style={{width:"30px",height:"30px",border: "1px solid #53E9FF", borderRadius: "50%",lineHeight:"30px",textAlign:"center"}}>六</span>
                        </div>
                    </form>
                </div>
                <div className="weui_btn_area">
                    <a className="weui_btn weui_btn_primary" href="javascript:" onClick={this.HandleSubmit}>设置闹铃</a>
                </div>
                <DialogCancel ref="dialogCancel" title={this.state.title}/>
                <ToastSuccess ref="toastSuccess" toast={this.state.toast}/>
                <ToastError ref="toastError" toast={this.state.toast}/>
            </div>
        )
    }

});

// export default Alarm;

module.exports = Alarm;