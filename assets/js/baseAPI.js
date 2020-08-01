//拦截 过滤 每次ajax请求，配置每次请求需要的参数
var baseURL = 'http://ajax.frontend.itheima.net';

$.ajaxPrefilter(function(options) {
    options.url = baseURL + options.url;


    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function(res) {
        // console.log('执行了 complete 回调：')
        // console.log(res)
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        var data = res.responseJSON;
        console.log(data);

        if (res.responseJSON.status === 1 && res.responseJSON.message === 'res.message ') {
            // 1. 强制清空 token
            localStorage.removeItem('token')
                // 2. 强制跳转到登录页面
            location.href = '/login.html'
        }
    }








})