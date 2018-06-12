/*
*  @personalFunc  personalRoutes 个人中心路由function
* */

const  utils = require('../utils');

let person = {};
module.exports = person;

person.ModifyNoValidate = async function (ctx,next) {
    let data = {};
    let reqData, search;
    reqData = ctx.request.body;

    await console.log( ctx.request.body, JSON.stringify(ctx.request.body),222222);
    search = () => {
        let value = [data.nickName,data.photo,data.qq,data.uuid];
        return new Promise(function (resolve,reject) {
            utils.pool.getConnection((err,connect) => {
                if(err){
                    console.log(err);
                    reject(err);
                    return next(err);
                }

                connect.query(utils.modifyInfo.toNormal,value,(err,result) => {
                    if(err){
                        console.log(err);
                        reject(err);
                        return next(err);
                    }
                    connect.release();
                    console.log(result);

                })
            });
        });

    }


    // await search();

};

person.ModifyValidate = function (ctx,next) {

};