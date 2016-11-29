/**
 * Created by xxx on 2016/8/23.
 */


function CreateXHR(obj) {
    var xhr = new XMLHttpRequest(),
        data = new FormData();              //利用FormData对象传输表单数据
    var handler = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                obj.success(xhr.response);
                if(obj.complete){
                    obj.complete();
                }
            }else {
                obj.error(xhr);
            }
        }

    };

    xhr.open(obj.type, obj.url, true);
    xhr.responseType = "json";
    xhr.onreadystatechange = handler;
    for (var name in obj.data) {
        data.append(name, obj.data[name]);
    }
    xhr.send(data);
}

export default CreateXHR;