/*
*  @personalRoutes 个人中心路由，包含修改信息、新建、成为会员等等路由
* */

const utils = require('../utils');
const router = new require('koa-router')();
const routeFunc = require('../routFunc/personalFunc');



router.post('modifyNormal',async (ctx,next) => {
    // 修改个人信息，无需验证的信息类
    await routeFunc.ModifyNoValidate(ctx,next);
} );

router.post('modifyPhoneOrEmail', async (ctx,next) => {
    // 需要验证的信息，如 手机，邮箱等
    await routeFunc.ModifyValidate(ctx,next);
})




module.exports = router;