/*
*  @pagesRoutes 所有页面的get请求统一在此路由处理
* */
const Router = require('koa-router');
let pagesRoutes = new Router();
pagesRoutes.get('', async (ctx) => {
    await ctx.render('index', {
        Hello: 'HelloWorld',
    });
}).get('home', async (ctx) => {
    await ctx.render('index', {
        Hello: 'HelloWorld',
    });
}).get('register', async (ctx) => {
    await ctx.render('register');
}).get('login', async (ctx) => {
    await ctx.render('login');
}).get('edit',async(ctx)=>{
    await ctx.render('edit')
}).get('personalPage',async(ctx)=>{
    await ctx.render('personalPage');
});
module.exports = exports = pagesRoutes;

