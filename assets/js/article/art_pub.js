$(function() {
    // 1.渲染文章分类
    initCate();

    // 2.初始化富文本编辑器
    initEditor()

    // 3.1. 初始化图片裁剪器
    var $image = $('#image')

    // 3.2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3.3. 初始化裁剪区域
    $image.cropper(options)

    // 4.1 修改文字封面
    $("#btnChooseImage").on("click", function() {
            $("#coverFile").click();
        })
        // 4.2 修改文字封面
    $("#coverFile").on("change", function(e) {
        var file = e.target.files[0];
        if (file.length === 0) {
            return layer.msg("请上传图片！");
        }
        // 创建图片地址
        var newImgURL = URL.createObjectURL(file)
            // 修改显示图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 5.1 确定发布状态
    var state = "已发布";
    // $("#btnSave1").click(function () {
    //     state = "已发布"
    // })
    $("#btnSave2").click(function() {
        state = "草稿"
    })

    // 5.2 添加文章(上面的两个按钮，点击哪个都会触发submit)
    $("#form-add").on("submit", function(e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append("state", state);
        // base64是字符串
        // 生成二进制图片文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            // 将 Canvas 画布上的内容，转化为文件对象
            .toBlob(function(blob) {
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                console.log(...fd);
                // ajax一定要放到回调函数里面
                // 因为生成文件是耗时操作，异步，所以必须保证发送ajax的时候图片已经生成，所以必须写到回调函数中
                publishArticle(fd);
            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                    // 发布文章成功后，跳转到文章列表页面
                    // window.parent.document.getElementById("a2").click()
                location.href = '/article/art_list.html'
                window.parent.document.getElementById("a2").className = "layui-this";
                window.parent.document.getElementById("a3").className = "";
            }
        })
    }

    // 渲染文章分类封装
    var form = layui.form;

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 重新渲染form，数据与页面同步
                form.render()
            }
        })
    }


})