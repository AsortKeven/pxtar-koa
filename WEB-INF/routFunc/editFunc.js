/*
*  @editFunc  editRoutes 编辑路由function
* */

const utils = require('../utils');
const fs = require('fs');
const images = require('images');
const editFunc = {
    //全局保存
    /*
    * @params   type: 'post',
                url: '/saveAll',
                dataType: 'json',
                 data: {
                        uuid: '',
                        datas: 全局数据,
                        name: 名称+话数(是阿拉伯数字123...)
                     }
    * */
    savaAllFunc: async (ctx) => {
        let [
            uuid,
            name,
            datas
        ] = [
            ctx.request.body.uuid,
            ctx.request.body.name,
            ctx.request.body.datas,
        ];
        console.log(datas);
        let saveDatas = () => {
            return new Promise((resolve, reject) => {
                utils.pool.getConnection((err, connection) => {
                    connection.query(utils.sqls.selectComic, uuid, (err, result) => {
                        if (err || !result) {
                            return console.error(err);
                        } else {
                            let length = result.length;
                            connection.release();
                            for (let i = 0; i < length; i++) {
                                if (name === result[i].comicName) {
                                    console.log(result[i].sourceFile, JSON.stringify(datas));
                                    if (utils.newFile(result[i].sourceFile, utils.chToPy(name) + '.txt', JSON.stringify(datas))) {
                                        resolve(true);
                                    }
                                }
                            }
                        }
                    })
                })
            })
        };
        let rel = await saveDatas();
        console.log(rel);
        if (rel) {
            ctx.body = 'true';
        }
    },
    newToolFunc: async (ctx) => {
        let [
            fileData,
            fileSize,
            fileType,
            fileName,
            comicName,
            uuid
        ] = [
            ctx.request.body.fileData,
            ctx.request.body.fileSize,
            ctx.request.body.fileType,
            ctx.request.body.fileName,
            utils.chToPy(ctx.request.body.comicName),
            ctx.request.body.uuid
        ];
        let sendDatas = {};
        let base64Data;
        if (fileType === 'image/*') {
            base64Data = fileData.replace(/^data:image\/\w+;base64,/, "");
        } else {
            base64Data = fileData.replace(/^data:audio\/\w+;base64,/, "");
        }
        let dataBuffer = new Buffer(base64Data, 'base64');
        let newPath = utils.filePath + uuid + '/' + comicName;
        if (utils.newDir(newPath, 'sourceFiles')) {
            if (utils.newFile(newPath + '/sourceFiles', fileName, dataBuffer)) {
                if (fileType === 'image/*') {
                    sendDatas.imgW = images(dataBuffer).width();
                    sendDatas.imgH = images(dataBuffer).height();
                    sendDatas.url = uuid + '/' + comicName + '/sourceFiles/' + fileName;
                    sendDatas.status = true;
                } else {
                    sendDatas.url = uuid + '/' + comicName + '/sourceFiles/' + fileName;
                    sendDatas.status = true;
                }
            } else {
                sendDatas.status = false;
            }
        }
        ctx.body = sendDatas;
    },
    newBgmFunc: async (ctx) => {
            let [
                fileName,
                fileData,
                fileType,
                uuid,
                comicName
            ]=[
                ctx.request.body.fileName,
                ctx.request.body.fileData,
                ctx.request.body.fileType,
                ctx.request.body.uuid,
                utils.chToPy(ctx.request.body.comicName)
            ];
        let sendDatas = {};
        let base64Data = fileData.replace(/^data:audio\/\w+;base64,/, "");
        let dataBuffer = new Buffer(base64Data, 'base64');
        let newPath = utils.filePath + uuid + '/' + comicName;
        if (utils.newFile(newPath + '/sourceFiles', fileName, dataBuffer)) {
            sendDatas.url = uuid + '/' + comicName + '/sourceFiles/' + fileName;
            sendDatas.status = true;
        } else {
            sendDatas.status = false;
        }
        ctx.body = sendDatas;
    }
};

module.exports = exports = editFunc;