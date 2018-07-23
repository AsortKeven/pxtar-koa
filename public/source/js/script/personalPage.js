/**
 * Created by Administrator on 2017/12/26.
 */
var curId = 1;

var contens = document.querySelectorAll('.xk-per-content');
//console.log(contens);

//主显示区切换
$('#nav li').click(function () {
    $(this).siblings('li').removeClass('xk-per-nav-active');
    $(this).addClass('xk-per-nav-active');
    curId = this.getAttribute('data-id');

    checkId(curId);
});

//点击判定
function checkId(id) {
    // console.log(id);
    for (var i = 0; i < contens.length; i++) {
        if (id === '3') {
            if (confirm('确定要注销登录么？')) {
                alert('注销成功');
                return;
            } else {
                return;
            }
        }
        if (i === parseInt(id)) {
            contens[i].style.cssText = 'display:block';
        }
        else {
            contens[i].style.cssText = 'display:none';
        }
    }
}

//修改信息
$('#xk-per-modify').unbind('click').click(function () {
    console.log('modify user infos');
    var lists = '';
    var nodeInfos = '';
    var xkInpur = $('.xk-per-input'),
        xkimg = $('.img-circle'),
        xkform = $('.xk-per-infos')[0],
        xkfile = $('.xk-per-infos input[type="file"]');
    xkInpur.children().each(function () {
        var value = $(this).find('span').html();
        $(this).find('span').removeAttr('value');
        var name = $(this).find('span').attr('id')
        var temp = this.innerHTML;
        var str1 = /<span/g;
        var str2 = /<\/span>/g;
        nodeInfos += '<p>' + temp + '</p>';
        temp = temp.replace(str1, '<input')
                .replace(str2, '')
                .split('>')[0] + 'name="' + name + '" value="' + value + '"/>';
        this.parentNode.removeChild(this);
        lists += '<p>' + temp + '</p>';
    });
    xkInpur.html(lists);

    // 获取各个节点信息
    var uuid = 'b1d837e2-87ed-48e3-a6a7-0fa65d51caef';

    var photoFile = $(xkform).find('input[name=file]')[0].files[0];
    var photoInput = $(xkform).find('.img-circle')[0];

    var photoDate = new FileReader();
    // var photo = photoDate.readAsDataURL(photoInput);

    var idNickName = xkInpur.find('#xk-per-nickname');
    var idUserName = xkInpur.find('#xk-per-username');
    var idQQ = xkInpur.find('#xk-per-QQ');
    var idPhone = xkInpur.find('#xk-per-phone');
    var idEmail = xkInpur.find('#xk-per-email');

    var nickValue = idNickName.val();
    var userValue = idUserName.val();
    var qqValue = idQQ.val();
    var phoneValue = idPhone.val();
    var emailValue = idEmail.val();
    // 头像目前先不处理



    $('#xk-per-save').css('display', 'block');
    $('.xk-per-saveGroup').unbind('click').click(function () {
        var html = '';
        if (this.getAttribute('name') === 'no') {//取消修改
            xkInpur.empty();
            xkInpur.html(nodeInfos);
            nodeInfos = '';
            lists = '';
        }
        ;
        if (this.getAttribute('name') == 'yes') {//确定修改
            var formdata = upFile.objFile(xkform, xkfile);
            xkInpur.children().each(function () {
                var _this = $(this);
                var vaLue = _this.children().val();
                var temp = this.innerHTML;
                temp = temp.replace(/<input/, '<span')
                        .replace(/>/, '></span>')
                        .split('>')[0] + '>' + vaLue;
                html += '<p>' + temp + '</p>'
            });
            xkInpur.html(html);
            nodeInfos = '';
            lists = '';
            xkimg.attr('src', formdata.objfile);

            // 获取上传的文件节点
            // idNickName = xkInpur.find('#xk-per-nickname');
            // idUserName = xkInpur.find('#xk-per-username');
            // idQQ = xkInpur.find('#xk-per-QQ');
            // idPhone = xkInpur.find('#xk-per-phone');
            // idEmail = xkInpur.find('#xk-per-email');
            // console.log(nickValue,userValue,qqValue,phoneValue,emailValue);
            // console.log(idNickName.val(),idUserName.val(),idQQ.val(),idPhone.val(),idEmail.val());
            var data = {};
            if( nickValue != idNickName.val() ){
                data["nickName"] = idNickName.val();
            }
            if( userValue != idUserName.val() ){
                data["user"] = idUserName.val();
            }
            if( qqValue != idQQ.val() ){
                data["qq"] = idQQ.val();
            }
            if( phoneValue != idPhone.val() ){
                data["photo"] = idPhone.val();
            }
            if( emailValue != idEmail.val() ){
                data["mails"] = idEmail.val();
            }

            data["uuid"] = uuid;




            console.log(data);
            $.ajax({//上传修改数据
                type: 'post',
                url: '/modifyNormal',
                datatype: 'json',
                data: data,
                // data: {"uuid": uuid,"nick": idNickName.text(), "photo": photo, "qq": idQQ.text()},
                // data: formdata.formdata,
                success: function (req) {
                    console.log(req)
                }
            })
        }
        $('#xk-per-save').css('display', 'none');
    });
});

$('#xk-per-beVip').click(function () {
    //console.log(this.parentNode.childNodes.length === 12);
   // if (this.parentNode.childNodes.length === 12) {
        var node = document.createElement('form');
        var childnode = document.createElement('input');
        var submit = document.createElement('input');
        node.action = 'becomeVip';
        node.method = 'post';
        childnode.value = '';
        childnode.name = 'inviteNum';
        submit.type = 'submit';
        submit.value = '提交';
        node.appendChild(childnode);
        node.appendChild(submit);
        this.parentNode.appendChild(node);
  //  }
});

//新建单话
var inName = $('input[name=name]'),
    inNumber = $('input[name=number]');
var upload = $("#upload");
var uploadFile;
var box = $('.xk-per-box');
var datas;
$(".xk-per-box-img").on('click', function () {
    upload.attr('type', 'file');
    upload.unbind('click').click();
});

upload.change(function (e) {
    uploadFile = e.target.files[0];
    // objUrl=upFile.getObjectURL(_thisf);
    console.log(uploadFile);
});

$('.xk-per-box-but-yes').click(function () {//确定新建
    var date = new Date();
    var nav, html, objUrl, file;
    box.css('display', 'none');
    datas = {
        name: inName.val(),
        num: inNumber.val(),
        time: date.toLocaleString()
    };
    var reader = new FileReader();
    var allowSize = 2100000;//限制大小2M
    var imgBase64 = reader.readAsDataURL(uploadFile);
    reader.onload = function () {
        if (allowSize !== 0 && allowSize < reader.result.length) {
            alert('上传失败，请选择小于2M的图片');
            return;
        } else {
            datas.imgData = reader.result;
            console.log(datas);
            $.ajax({//新建单话数据
                type: 'post',
                url: '/newComic',
                datatype: 'json',
                data: datas,
                success: function (res) {
                    console.log(res)
                }
            });
        }
    };
});

$('.xk-per-cartoon-addbtn').click(function () {
    box.css('display', 'block');
    inName.val("");
    inNumber.val("");
    upload.attr('type', 'txt')
    $('.xk-per-box-but-yes').attr('disabled', 'disabled');
});

$('.xk-per-box-but-no').on('click', function () {//取消新建
    box.css('display', 'none');
    inName.val("");
    inNumber.val("");
    upload.attr('type', 'txt')
    inName.css('border', '1px solid #ddd');
    inNumber.css('border', '1px solid #ddd');
});
//判断格式
inName.change(function () {
    if (inName.val() == "") {
        inName.css('border', '1px solid red');
        $('.xk-per-box-but-yes').attr('disabled', 'disabled')
    } else {
        inName.css('border', '1px solid #ddd');
    }
    ;
    if (inName.val() !== "" && inNumber.val() !== "") {
        $('.xk-per-box-but-yes').removeAttr('disabled')
    }
});
inNumber.change(function () {
    if (inNumber.val() == "") {
        inNumber.css('border', '1px solid red');
        $('.xk-per-box-but-yes').attr('disabled', 'disabled');
    } else {
        inNumber.css('border', '1px solid #ddd');
    };
    if (inName.val() !== "" && inNumber.val() !== "") {
        $('.xk-per-box-but-yes').removeAttr('disabled');
    }
});

//鼠标悬浮到单话
$('.xk-per-cinter-nav').on('mouseenter mouseleave', '.xk-cartoon-box-top', function (event) {
    var _this = $(this);
    if (event.type == "mouseenter") {
        //鼠标悬浮
        _this.find('.xk-cartoon-box-top-top').animate({top: 0});
        _this.find('.xk-cartoon-box-bottom').animate({bottom: 0});

    } else if (event.type == "mouseleave") {
        //鼠标离开
        $(this).find('.xk-cartoon-box-bottom').animate({bottom: '-1.5rem'});
        $(this).find('.xk-cartoon-box-top-top').animate({top: '-1.5rem'})
    }

});

//点击事件
$('.xk-per-cinter-nav').on('click', function (e) {
    var _this = e.target||e.srcElement;
    var e_this = _this.innerText;
    var This = $(this)
    console.log(This)
    switch (e_this){
        case '删除':
            _this.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            break;
        case '编辑':
            alert('这是编辑')
            break;
        case '预览':
            alert('这是预览');
            break;
        case '查看':
            var _this_id = _this.getAttribute('data-id')
            console.log(_this_id);
            This.find('.xk-per-list-style').remove();
            var data = add_html.data_cookie();
            var html = add_html.allHtml(data)[1];
            console.log(html);
            This.append(html[_this_id])
            break;
    }
});

var add_html = {
    addCartoon:function (data) {//漫画系列内容话数
        var html = '<div class="xk-per-list xk-per-list-style">' +
            '<div class="xk-per-cartoon-box">' +
            '<div class="xk-cartoon-box-top xk-cartoon-item-style">' +
            '<p class="xk-cartoon-box-nav xk-cartoon-box-top-top">' +
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-left"><a href="##">预览</a></span>' +
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-right"><a href="##">编辑</a></span>' +
            '</p>' +
            '<p class="xk-cartoon-box-nav xk-cartoon-box-bottom">' +
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-left"><a href="##">删除</a></span>' +
            '</p>' +
            '<img class="xk-per-cartoon-img" src="' + data.img + '">' +
            '</div>' +
            '<p class="xk-cartoon-box-center xk-cartoon-item-style">' +
            '<span class="xk-per-cartoon-txt xk-per-cartoon-name">' + data.name + '</span>' +
            '<span class="xk-per-cartoon-txt xk-per-cartoon-number">' + data.num + '</span>' +
            '</p>' +
            '<p class="xk-cartoon-box-bottom xk-cartoon-item-style">' +
            '<span class="xk-per-cartoon-txt">' + '最后:' + data.time + '</span>' +
            '</p>' +
            '</div>' +
            '</div>';
        return html;
    },
    addNumber:function (data) {//漫画系列
        var html = '<div class="xk-per-list xk-per-list-style">' +
            '<div class="xk-per-cartoon-box">' +
            '<div class="xk-cartoon-box-top xk-cartoon-item-style">' +
            '<p class="xk-cartoon-box-nav xk-cartoon-box-top-top">' +
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-left"><a href="##" data-id="'+data.id+'">查看</a></span>' +
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-right"><a href="##">编辑</a></span>' +
            '</p>' +
            '<p class="xk-cartoon-box-nav xk-cartoon-box-bottom">' +
            '<span class="xk-per-cartoon-txt xk-cartoon-box-btn xk-cartoon-box-left"><a href="##">删除</a></span>' +
            '</p>' +
            '<img class="xk-per-cartoon-img" src="' + data.img + '">' +
            '</div>' +
            '<p class="xk-cartoon-box-center xk-cartoon-item-style">' +
            '<span class="xk-per-cartoon-txt">' + data.name + '</span>' +
            '</p>' +
            '<p class="xk-cartoon-box-center xk-cartoon-item-style">' +
            '<span class="xk-per-cartoon-txt">' + '最后:' + data.time + '</span>' +
            '</p>' +
            '</div>' +
            '</div>';
        return html;
    },
    allHtml:function (data) {//个人中心漫画和所关联的话数
        var html='',Html = [],all_html = '';
        for (var i = 0;i<data.nav.length;i++){
            data.nav[i].id = i;
            html+=add_html.addNumber(data.nav[i]);
            var number = data.nav[i].nav
            for (var j = 0;j<number.length;j++){
                all_html+=add_html.addCartoon(number[j])
            };
            Html.push(all_html);
            all_html = '';
        };
        return [html,Html];
    },
    data_cookie:function (name) {//登录界面传递的cookie
        var data=$.cookie(name);
        data = JSON.parse(data);
        return data;
    }
};
var winload = function () {
    var data = add_html.data_cookie('data_cookie');
    console.log($.cookie('uuid'));
    var html = add_html.allHtml(data)[0];
    $('.xk-per-cinter-nav').append(html);
};

