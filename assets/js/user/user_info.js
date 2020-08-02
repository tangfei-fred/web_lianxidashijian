$(function() {
    var form = layui.form;
    var layer = layui.layer;

    // verify核实，证明
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    });

    // 初始化用户信息
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('res.message')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单数据
    //重置只接受click事件绑定
    $('#btnReset').on('click', function(e) {
        //取消浏览器的默认重置操作行为
        e.preventDefault();
        //初始化用户信息
        initUserInfo();
    })

    $('.layui-form').on('submit', function(e) {
        //阻止同步提交，该用ajax来提交
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                } else {
                    layer.msg('更新用户信息成功！')
                }
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                //window是当前fm 页面   parent是父页面
                window.parent.getUserInfo()
            }
        })
    })
})