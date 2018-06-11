const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const static = require('koa-static');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const pages = require('./routes/pagesRoutes');
const users = require('./routes/userRoutes');
const edits = require('./routes/editRoutes');
const app = new Koa();

//设置view路径
const curPath = __dirname.split('WEB-INF')[0];
app.use(views(path.join(curPath, 'public', 'views'), {
    map: {html: 'ejs'}
}));

//bodyparser解析post数据
app.use(bodyParser({
    formLimit:'5mb',
    jsonLimit:'5mb',
    textLimit:'5mb'
}));

//设置静态目录
app.use(static(path.join(curPath, 'public', 'source')));


let router = new Router();
router.use('/', pages.routes(), pages.allowedMethods());
router.use('/', users.routes(), users.allowedMethods());
router.use('/', edits.routes(), edits.allowedMethods());
router.get('*', async (ctx) => {
    await ctx.render('404');
});
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
    console.log('koa2 in running at http://localhost:3000')
});