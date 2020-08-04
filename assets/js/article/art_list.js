$(function() {
    // 为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function(date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 在个位数的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个全局变量，存储分页参数
    var p = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的状态，可选值有：已发布、草稿
    }

    // 1.初始化文章列表
    initTable();

    // 2.渲染文章分类
    initCate();

    // 3.筛选提交
    $("#form-search").on("submit", function(e) {
        e.preventDefault();
        // 修改p参数
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        p.cate_id = cate_id;
        p.state = state;
        // 初始化文章列表
        initTable()
    })

    // 4.删除
    $('body').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // 询问用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            // 发起请求，删除文章
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')

                    // 如果页面最后一条，且页码大于1，就查询之前一页的内容
                    $(".btn-delete").length === 1 && p.pagenum > 1 && p.pagenum--;
                    // if ($(".btn-delete").length===1) {
                    //     if (p.pagenum > 1) {
                    //         p.pagenum = p.pagenum -1;
                    //     }
                    // }

                    // 重新渲染文章列表
                    initTable();
                }
            })
            layer.close(index);
        })
    })

    // 5.修改页面跳转(事件委托)
    $("tbody").on("click", ".btn-edit", function() {
        // 页面跳转的时候要携带文章的 Id ，到文章修改页面通过 Id 获取文章详细信息
        var Id = $(this).attr('data-id');
        location.href = '/article/art_edit.html?Id=' + Id;
    })


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

    // 封装初始化文章列表函数
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: p,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // console.log(res)
                // 模板引擎渲染
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                // 文章分页
                renderPage(res.total);
            }
        })
    }

    // 文章分页
    function renderPage(total) {
        // 调用layui中的文章分页渲染
        layui.laypage.render({
            elem: 'pageBox',
            count: total,
            limit: p.pagesize,
            curr: p.pagenum,
            limits: [2, 3, 5, 10], // 每页显示多少条数据的选择器
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
            // 如果 first 的值为 true，证明是方式2触发的
            // 否则就是方式1触发的
            jump: function(obj, first) {
                // 把最新的页码值，赋值到 p 这个查询参数对象中
                p.pagenum = obj.curr
                    // 把最新的条目数，赋值到 p 这个查询参数对象的 pagesize 属性中
                p.pagesize = obj.limit
                    // 根据最新的 p 获取对应的数据列表，并渲染表格
                    !first && initTable();
            }
        });
    }

});