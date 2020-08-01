$(function() {
    getUserInfo()
        //引入layer
    var layer = layui.layer;
    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出  引入 弹出层-》confirm->eg1
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 关闭 confirm 询问框
            layer.close(index)
                //do something
                //清空本地存储中的 token
            localStorage.removeItem('token')
                //  重新跳转到登录页面
            location.href = '/login.html';

        });
    });

});



// 获取用户信息封装
//后面要用 所以必须是全局变量   后面 fm  要用
function getUserInfo() {

    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // 专门用于设置请求头信息的  headers属性区分大小写
        // headers: {
        //     //localStorage本地储存 中获取    Authorization要求必须写
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('res.message')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderUser(res.data)
        },


    })
}
//封装用户渲染函数
function renderUser(user) {

    //获取用户的名称
    var unname = user.nickname || user.username;
    console.log(unname);

    $('.welcome').html('欢迎&nbsp;&nbsp;' + unname);

    //  按需渲染用户的头像
    if (user.user_pic !== null) {
        //  渲染图片头像 attr图片属性
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
            //toUpperCase()字母大写
        var first = unname[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }
}