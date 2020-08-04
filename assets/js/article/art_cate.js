// $(function() {
//     var layer = layui.layer;
//     var form = layui.form;

//     //文章类别类表渲染
//     initArtCateList()

//     // 文章列表函数渲染分装
//     function initArtCateList() {

//         $.ajax({
//             method: 'GET',
//             url: '/my/article/cates',
//             success: function(res) {

//                 // 模板引擎渲染(传递对象，使用属性each 后面加个data)
//                 var htmlStr = template('tpl-table', res)
//                 $('tbody').html(htmlStr)
//             }
//         })
//     }
//     // 添加文章分类
//     var index = null
//     $("#addArtCate").on('click', function() {
//         index = layui.layer.open({
//             // type类型，1代表的是页面
//             type: 1,
//             area: ['500px', '250px'],
//             title: '添加文章分类',
//             content: $("#dialog-add").html()
//         });
//     })

//     //通过代理的形式。为boxAddCate表单绑定submit事件
//     $('body').on('submit', '#boxAddCate', function(e) {
//         e.preventDefault()
//         $.ajax({
//             method: 'POST',
//             url: '/my/article/addcates',
//             data: $(this).serialize(),
//             success: function(res) {
//                 if (res.status !== 0) {
//                     return layui.layer.msg('新增分类失败！')
//                 }
//                 initArtCateList()
//                 layui.layer.msg('新增分类成功！')
//                     // 根据索引，关闭对应的弹出层 close用法要用索引值
//                 layer.close(index)
//             }
//         })
//     })

//     var indexEdit = null
//     $('tbody').on('click', '.btn-edit', function() {
//         // 弹出一个修改文章分类信息的弹出框
//         indexEdit = layer.open({
//             type: 1,
//             area: ['500px', '250px'],
//             title: '修改文章分类',
//             content: $('#dialog-edit').html()
//         })

//         //弹出框后根据索引值调出要修改的内容
//         var id = $(this).attr('data-id')
//             //发起请求获取对应分类数据
//         $.ajax({
//             type: 'get',
//             url: '/my/article/cates/' + id,
//             success: function(res) {
//                 form.val('form-edit', res.data)
//             }
//         })
//     });

//     //通过代理的形式。为修改表单绑定submit事件
//     $('body').on('submit', '#form-edit', function(e) {
//         e.preventDefault()

//         $.ajax({
//             method: 'POST',
//             url: '/my/article/updatecate',
//             data: $(this).serialize(),
//             success: function(res) {
//                 if (res.status !== 0) {
//                     return layui.layer.msg('更新分类数据失败！')
//                 }
//                 layui.layer.msg('更新分类数据成功！')
//                     // 关掉窗口
//                 layer.close(indexEdit)
//                 initArtCateList()
//             }
//         })
//     })

//     //通过代理的形式。为删除表单绑定submit事件


//     $('tbody').on('click', '.btn-delete', function() {
//         var id = $(this).attr('data-id')
//             // 提示用户是否要删除
//         layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
//             $.ajax({
//                 method: 'GET',
//                 url: '/my/article/deletecate/' + id,
//                 success: function(res) {
//                     if (res.status !== 0) {
//                         return layer.msg('删除分类失败！')
//                     }
//                     layer.msg('删除分类成功！')
//                     layer.close(index)
//                     initArtCateList()
//                 }
//             })
//         })
//     })




// })



$(function() {
    // 1. 文章分类列表渲染
    initArtCateList();

    // 2. 添加文章分类 显示
    $("#addArtCate").on("click", function() {
        index = layui.layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })

    // 3. 文章分类添加
    var index = null;
    $("body").on("submit", "#boxAddCate", function(e) {
        e.preventDefault();
        // console.log($(this).serialize())
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("新增文章分类失败！")
                }
                initArtCateList();
                layui.layer.msg("恭喜您，新增文章分类成功！");
                // 关闭添加区域
                layui.layer.close(index);
            }
        })
    })

    // 4. 修改文章分类 显示
    var index2 = null;
    $("tbody").on("click", ".btn-edit", function() {
        // 4.1 展示
        index2 = layui.layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        // 4.2 渲染
        var Id = $(this).attr("data-id");
        $.ajax({
            url: '/my/article/cates/' + Id,
            success: function(res) {
                layui.form.val("dialog-edit", res.data);
            }
        })
    })

    // 5. 文章分类修改
    var index = null;
    $("body").on("submit", "#boxEditCate", function(e) {
        e.preventDefault();
        // console.log($(this).serialize())
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg("修改文章分类失败！")
                }
                initArtCateList();
                layui.layer.msg("恭喜您，修改文章分类成功！");
                // 关闭修改区域
                layui.layer.close(index2);
            }
        })
    })

    // 6. 删除文章分类
    $("tbody").on("click", ".btn-delete", function() {
        // 必须写到对话框之外，里面的this就改变了
        var Id = $(this).attr("data-id");
        // 询问框
        layer.confirm('是否确认删除当前文章分类?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message)
                    }
                    initArtCateList();
                    layui.layer.msg("恭喜您，删除文章分类成功！");
                    layer.close(index);
                }
            })
        });
    })

    // 文章分类列表渲染函数封装
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // 模板引擎渲染（传递对象，使用属性）
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }
});