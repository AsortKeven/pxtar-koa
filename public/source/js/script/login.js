/**
 * Created by P on 2018/1/9.
 */
//前端登陆数据判断
/*
*  登录时需要先获取cookie中的token，使用jquery的cookie插件
*  $.cookie('token')
* */

$('input[type=button]').click(function () {
    $('input[name=token]').val($.cookie('token'));
    var user={
        name:$('input[name=username]').val(),
        password:$('input[name=password]').val(),
    };
    if(user.name && user.password){
       $('#form').submit();
    }else {
        if(user.name.length===0){
            $('input[name=username]').css('border','1px solid red')
        }
        if(user.password===''){
            $('input[name=password]').css('border','1px solid red')
        }
    }

});
$('input').focus(function () {//获取焦点时效果
    $(this).css('border','1px solid #ddd')
});
