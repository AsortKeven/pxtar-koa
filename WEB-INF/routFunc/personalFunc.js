/*
*  @personalFunc  personalRoutes 个人中心路由function
* */

const  utils = require('../utils');

let person = {};
module.exports = person;

person.ModifyNoValidate = async function (ctx,next) {
    let data = {};
    let reqData, search;
    let sqlArr = [], sqlValue = [];
    reqData = ctx.request.body;

    Object.keys(reqData).forEach( k => {
        if(k != 'uuid'){
            sqlArr.push(k + ' = ?');
            sqlValue.push(reqData[k]);
        }
    });
    sqlValue.push(reqData.uuid);

    search = () => {
        return new Promise(function (resolve,reject) {
            utils.pool.getConnection((err,connect) => {
                if(err){
                    console.log(err);
                    reject(err);
                    return next(err);
                }

                connect.query('update userinfo set ' + sqlArr.join(',') + ' where uuid = ?' ,sqlValue,(err,result) => {
                    if(err){
                        console.log(err);
                        reject(err);
                        return next(err);
                    }
                    connect.release();
                    console.log(result);
                    resolve(result);
                    return result;
                })
            });
        });

    }


    await search();

};

person.ModifyValidate = function (ctx,next) {

};