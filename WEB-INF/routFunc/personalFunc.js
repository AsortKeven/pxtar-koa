/*
*  @personalFunc  personalRoutes 个人中心路由function
* */

const utils = require('../utils');
const jwt = require('jsonwebtoken');
const fs = require('fs');
let person = {
    ModifyNoValidate: async (ctx) => {
        let data = {};
        let reqData, search;
        let sqlArr = [], sqlValue = [];
        reqData = ctx.request.body;

        Object.keys(reqData).forEach(k => {
            if (k != 'uuid') {
                sqlArr.push(k + ' = ?');
                sqlValue.push(reqData[k]);
            }
        });
        sqlValue.push(reqData.uuid);

        search = () => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    if (err) {
                        return console.error(err);
                        reject(err);
                    }
                    connection.query('update userinfo set ' + sqlArr.join(',') + ' where uuid = ?', sqlValue, (err, result) => {
                        if (err) {
                            return console.error(err);
                            reject(err);
                        }
                        connection.release();
                        return console.error(err);
                        resolve(result);
                    })
                });
            });
        };
        let rel = await search();
        if (rel) {
            ctx.body = 'true';
        }
    },
    /* todo
     step 1 请求邮箱验证码||手机短信验证码,
     step 2 crypto.js加密返回验证码给前端，
     step 3 前端收到用户输入的验证码,加密后对比，
     step 4 发起请求，修改信息，
     step 5 修改完成返回状态,*/
    ModifyValidate: async (ctx) => {

    },
    //personalPage 渲染逻辑
    checkToken: async (ctx, next) => {
        let reqDatas = ctx.request.body;
        let resDatas={};
        if (reqDatas.token) {
            let cert = fs.readFileSync('./pxtarKey.key');
            console.log('token check!');
            try {
                let rel = jwt.verify(reqDatas.token, cert);
                if (rel.data.uuid === reqDatas.uuid) {
                    //todo 进行后面的数据查询
                    console.log('start getInfo');
                    let userDatas = await person.getUser(reqDatas.uuid);
                    let infoDatas = await person.getInfo(reqDatas.uuid);
                    console.log('========================================');
                    console.log(userDatas);
                    console.log('========================================');
                    console.log(infoDatas);
                    console.log('========================================');
                    resDatas.userData = userDatas;
                    resDatas.infoDatas = infoDatas;
                    ctx.body = resDatas;
                }
            } catch (e) {
                ctx.body = false;
            }
        } else {
            ctx.body = false;
        }
    },
    getUser: async (uuid) => {
        let searchData = () => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    if (err) {
                        return console.error(err);
                        reject(false);
                    } else {
                        connection.query(utils.sqls.selectUserinfo, uuid, (err, result) => {
                            if (err) {
                                return console.error(err);
                                reject(false);
                            } else {
                                resolve(result[0]);
                            }
                        })
                    }
                })
            })
        };
        return await searchData();
    },
    getInfo: async (uuid) => {
        let searchData = () => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    if (err) {
                        return console.error(err);
                        reject(false);
                    } else {
                        connection.query(utils.sqls.selectComic, uuid, (err, result) => {
                            if (err) {
                                return console.error(err);
                                reject(false);
                            } else {
                                resolve(result[0]);
                            }
                        })
                    }
                })
            })
        };
        return await searchData();
    }
};
module.exports = person;
