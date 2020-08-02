$(function() {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域
    $image.cropper(options)





    //修改上传图片
    $('#btnChooseImage').on('click', function() {
        $("#file").click();
    })

    //input改变，渲染裁剪区徐
    $("#file").on("change", function(e) {
        //文件列表


        // e.target.files
        // $("#file")[0].files
        // document.querySelector("#file").files

        // 1. 拿到用户选择的文件
        var file = e.target.files[0];
        if (file.length === 0) {
            return layer.msg('请选择图片')
        }

        // 2. 将文件，转化为路径
        var newImgURL = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    $("#btnUpload").on("click", function() {
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            .toDataURL('image/png')

        $.ajax({
            method: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg("头像上传成功");
                window.parent.getUserInfo
            }
        })


    })


})