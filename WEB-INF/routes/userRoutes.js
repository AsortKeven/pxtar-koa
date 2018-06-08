/*
* @userRoutes 用户路由，登录注册相关路由
*  @important 所有路由中调用处理函数必须使用await 函数外必须使用async
* */
const Router = require('koa-router');
const userFunc = require('../routFunc/userFunc');
let userRoutes = new Router();

userRoutes
    .post('login', async (ctx) => {
        await userFunc.loginFunc(ctx);
    })
    .post('personalPage', async (ctx) => {
        await userFunc.personalFunc(ctx);
    })
    //注册
    // todo 02 暂时这样，获取验证码注册后续添加
    .post('register', async (ctx) => {
        await userFunc.registerFunc(ctx);
    });

module.exports = exports = userRoutes;