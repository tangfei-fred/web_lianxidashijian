//拦截 过滤 每次ajax请求，配置每次请求需要的参数
var baseURL = 'http://ajax.frontend.itheima.net';

$.ajaxPrefilter(function(options) {
    options.url = baseURL + options.url;
})