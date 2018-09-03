/*
*  @userFunc  userRoutes 用户路由function
* */
const utils = require('../utils');
const jwt = require('jsonwebtoken');
const fs = require('fs');
//登录结果loginResult
const loginResult = {
    loginStatus: false,
    uuid: '',
    userinfo: {},
    isChecked: '',
    discription: '',
    photo: '',
    address: '',
    production: '',
    profession: '',
    authority: ''
};
/*
* @params ctx 请求
* */
let user = {
    //todo 登录逻辑需要修改，token仅用于免登陆
    loginFunc: async (ctx) => {
        let cert = fs.readFileSync('./pxtarKey.key');
        let reqDatas = ctx.request.body;
        console.log(reqDatas);
        let [
            username,
            password,
            token
        ] = [
            reqDatas.username,
            reqDatas.password,
            reqDatas.token
        ];
        let temp, search;
        if (utils.check(username)) {
            let str = '%' + username + '%';
            search = () => {
                return new Promise((resolve, reject) => {
                    //所有数据库连接都应从连接池中获取，并在操作完成后释放连接
                    utils.pool.getConnection((err, connection) => {
                        if (err) {
                            return console.error(err);
                        }
                        connection.query(utils.sqls.logincheck, str, (err, result) => {
                            if (err || !result) {
                                return console.error(err);
                            } else if (result.length === 0) {
                                temp = false;
                            } else if (password !== result[0].password) {
                                temp = false;
                                console.log(result);
                            } else {
                                console.log(result[0], password);
                                [loginResult.loginStatus, loginResult.uuid] = [true, result[0].UUID];
                                console.log(loginResult.loginStatus, loginResult.uuid);
                                temp = true;
                            }
                            connection.release();
                            resolve(temp);
                        })
                    })
                })
            }
        } else {
            temp = false;
        }
        temp = await search();
        if (temp) {
            let newToken = jwt.sign({
                exp: Math.floor(Date.now() / 1000 + (60 * 60 * 7 * 24)),//暂定token过期时间1周
                data: loginResult
            }, cert);
            ctx.cookies.set('token', newToken, {
                domain: 'localhost',
                path: '/',
                httpOnly: false 
            });
            ctx.cookies.set('uuid', loginResult.uuid, {
                domain: 'localhost',
                path: '/',
                httpOnly: false
            });
            /*
            * todo 01 登陆完成需要执行跳转 暂时测试数据如下
            * */
            let data = [{
                name: '画诡',
                time:'2017-06-26',
                img: 'data:image/png;base64',
                nav:[{
                    name: '画诡',
                    num:'第一话',
                    time:'2017-06-26',
                    img: 'data:image/png;base64',
                },
                    {
                        name: '画诡',
                        num:'第二话',
                        time:'2017-06-26',
                        img: 'data:image/png;base64',
                    }]
            },
                {
                    name: '星动集',
                    time:'2017-06-26',
                    img: 'data:image/png;base64',
                    nav:[{
                        name: '星动集',
                        num:'第一话',
                        time:'2017-06-26',
                        img: 'data:image/png;base64',
                    },
                        {
                            name: '星动集',
                            num:'第二话',
                            time:'2017-06-26',
                            img: 'data:image/png;base64',
                        }]
                }];
            ctx.body = {
                uuid: 'e306db67-5277-490e-a164-00539d6d7716',
                nav: data
            };
        } else {
            ctx.body = false;
        }
    },
    //post请求personalPage处理函数
    personalFunc: async (ctx) => {
        console.log(ctx.request.body);
        let uuid = ctx.request.body.uuid;
        let searchAll = () => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    connection.query(utils.sqls.selectLogininfo, uuid, (err, result) => {
                        if (err)
                            return console.error(err);
                        else {
                            [
                                loginResult.loginStatus,
                                loginResult.uuid,
                                loginResult.userinfo,
                                loginResult.isChecked
                            ] = [
                                true,
                                uuid,
                                result[0].userInfos,
                                result[0].isChecked
                            ]
                        }
                    });
                    connection.release();
                    resolve(loginResult);
                });
            })
        };

        let searchInfo = (msg) => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    connection.query(utils.sqls.selectUserinfo, uuid, (err, result) => {
                        if (err)
                            return console.error(err);
                        else {
                            [
                                msg.discription,
                                msg.photo,
                                msg.address,
                                msg.production,
                                msg.profession,
                                msg.authority
                            ] = [
                                result[0].discription,
                                result[0].photo,
                                result[0].address,
                                result[0].production,
                                result[0].profession,
                                result[0].authority
                            ];
                            msg.userinfo = JSON.parse(msg.userinfo);
                            connection.release();
                            resolve(msg);
                        }
                    })
                })
            })
        };
        let temp = await searchAll();
        let rel = await searchInfo(temp);
        console.log(rel);
        ctx.body = rel;
    },
    //注册处理函数
    registerFunc: async (ctx) => {
        let user = {};
        [
            user.nickname,
            user.password,
            user.phone,
            user.email,
            user.job,
            user.uuid
        ] = [
            ctx.request.body.nickname,
            ctx.request.body.password,
            ctx.request.body.phone,
            ctx.request.body.email,
            ctx.request.body.job,
            utils.uuid()
        ];
        let userRandom = utils.userRandom();
        let tousers = [user.uuid, user.nickname, user.job];
        let userinfo, tologin;
        let flag = true;
        //获取所有用户
        let checkUser = () => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    if (err)
                        return console.error(err);
                    else
                        connection.query(utils.sqls.selectAllUser, (err, result) => {
                            if (err)
                                return console.error(err);
                            else {
                                connection.release();
                                resolve(result);
                            }
                        })
                })
            })
        };
        let users = await checkUser();
        //用户名去重
        let initUser = (() => {
            let l = users.length;
            if (l !== 0) {
                console.log("start check");
                console.log(users[0]);
                do {
                    for (let i = 0; i < l; i++) {
                        if (JSON.parse(users[i].userInfos).用户名 === userRandom) {
                            userRandom = utils.userRandom();
                            console.log("new random");
                            break;
                        }
                        else {
                            flag = false;
                            userinfo = JSON.stringify(({用户名: userRandom, 手机: user.phone, 邮箱: user.email}));
                            tologin = [user.uuid, userinfo, user.password];
                        }
                    }
                } while (flag);
            }
        })();
        //添加用户到数据库
        let addUser = () => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    connection.query(utils.sqls.register.toUsers, tousers, (err, result) => {
                        if (err)
                            return console.error(err);
                        else {
                            console.log(result);
                        }
                    });
                    connection.query(utils.sqls.register.toLogin, tologin, (err, result) => {
                        if (err)
                            return console.error(err);
                        else {
                            console.log(result);
                            connection.release();
                        }
                    });
                    resolve(true);
                })
            })
        };
        let addrel = await addUser();
        if (addrel) {
            await ctx.render('about', {Hello: user.job});
        }
    }
};

module.exports = exports = user;