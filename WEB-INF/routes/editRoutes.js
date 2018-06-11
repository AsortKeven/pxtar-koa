/*
* @editRoutes 编辑器路由，编辑器页面所有的路由都应封装在此
* */
const Router = require('koa-router');
const editFunc = require('../routFunc/editFunc');
let editRouter = new Router();

editRouter
//全局保存
    .post('saveAll', async (ctx) => {
        await editFunc.savaAllFunc(ctx);
    })
    .post('newTools', async (ctx) => {
        await editFunc.newToolFunc(ctx);
    })
    .post('newBgm', async (ctx) => {
        await editFunc.newBgmFunc(ctx);
    });

module.exports = exports = editRouter;