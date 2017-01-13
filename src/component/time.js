/**
 * Created by user on 2016/8/11.
 */

/*  set today,yesterday bYesterday*/


var time = new Date();
var today, yesterday, bYesterday;
var day = time.getDate();
var month = time.getMonth() + 1;
var year = time.getFullYear();
var yYear = year;
var bYear = year;
var yMonth = month;
var bMonth = month;
var yDay = day - 1;
var bDay = day - 2;

switch (month) {
    case 1:

        if (day == 1) {
            yMonth = 12;
            yDay = 31;
            yYear--;
            bYear--;
        }
        if (day == 2) {
            bMonth = 12;
            bDay = 31;
            bYear--;
        }
        break;
    case 3:
        if (day == 1) {
            yMonth = 2;
            if ((year % 4) == 0) {
                yDay = 29;
            } else {
                yDay = 28;
            }
        }
        if (day == 2) {
            bMonth = 2;
            if ((year % 4) == 0) {
                bDay = 29;
            } else {
                bDay = 28;
            }
        }
        break;
    case 5:
    case 7:
    case 10:
    case 12:
        if (day == 1) {
            yMonth = month - 1;
            yDay = 30;
        }
        if (day == 2) {
            bMonth = month - 1;
            bDay = 30;
        }
        break;
    case 2:
    case 4:
    case 6:
    case 8:
    case 9:
    case 11:
        if (day == 1) {
            yMonth = month - 1;
            yDay = 31;
        }
        if (day == 2) {
            bMonth = month - 1;
            bDay = 31;
        }
        break;
}
yesterday = yYear + '-' + yMonth + "-" + yDay;
bYesterday = bYear + '-' + bMonth + "-" + bDay;
if (day == 1) {
    yesterday = yYear + '-' + yMonth + "-" + yDay;
    bYesterday = bYear + '-' + yMonth + "-" + (yDay - 1);
}
if (day == 2) {
    bYesterday = bYear + '-' + bMonth + "-" + bDay;
}
today = year + '-' + (time.getMonth() + 1) + "-" + time.getDate();


export {today,yesterday,bYesterday};