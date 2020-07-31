$(function() {
    $("#link_reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    })
})

var form = layui.form
var layer = layui.layer
    //利用form这个对象，创建规则
form.verify({
    // 自定义了一个叫做 pwd 校验规则 属性可以是数组也可以是duix
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格!'],

    repwd: function(value, item) {
        if ($("#reg-pwd").val() !== value) {
            return '两次密码不一致！'
        }
    }
});

$("#form_reg").on("submit", function(e) {
    e.preventDefault();
    //ajax发起异步提交
    $.ajax({
        type: "post",
        url: '/api/reguser',
        data: {
            username: $("#form_reg [name=username]").val(),
            password: $("#form_reg [name=password]").val()
        },
        success: function(res) {
            //注册校验
            if (res.status != 0) {
                return layer.msg(res.message);
            }
            //注册成功提示
            layer.msg(res.message);
            //触动切换到登录的a连接的点击行为
            $("#link_login").click();
            //清空表单
            $("#form_reg")[0].reset();
        }
    })
})

//表单登录
$('#form_login').submit(function(e) {
    // 阻止默认提交行为
    e.preventDefault()

    $.ajax({
        url: '/api/login',
        method: 'POST',
        // 快速获取表单中的数据
        data: $(this).serialize(),
        success: function(res) {
            //注册校验
            if (res.status !== 0) {
                return layer.msg('登录失败！')
            }
            layer.msg('登录成功！')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
            localStorage.setItem('token', res.token)
                // 跳转到后台主页
            location.href = '/index.html'
        }
    })
})