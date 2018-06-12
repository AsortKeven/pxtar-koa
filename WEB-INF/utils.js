const mysql = require('mysql');
const pinyin = require('pinyin');
const fs = require('fs');
const utils = {
    pool: mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'runger',
        database: 'pxtar'
    }),
    filePath: 'G:/Pxtar/LocalGit/',
    sqls: {
        inviteNums: {
            getAll: 'select * from inviteNums',
            isUsed: 'select usable from invitenums where inviteNum = ?',
            changeUsable: 'update invitenums set usable = "0" where inviteNum = ?'
        },
        register: {
            toUsers: 'insert into userinfo(UUID,nickName,profession) values(?,?,?)',
            toLogin: 'insert into logininfo(UUID,userInfos,password) values(?,?,?)'
        },
        modifyInfo: {
            toAuthority: 'update userinfo set authority = "2" where uuid = ?',
            toDiscription: 'update userinfo set discription = ? where uuid = ?',
            toAddress: 'update userinfo set address = ? where uuid = ?',
            getProduction: 'select production from userinfo where uuid = ?',
            toProduction: 'update userinfo set production = ? where uuid = ?',
            toPassword: 'update logininfo set password = ? where uuid = ?',
            toNormal: 'update userinfo set nickname = ?,photo = ?,qq = ? where uuid = ?',
            toUserInfo: 'update logininfo set userInfos = ? where uuid = ?',
            selectUserInfos: 'select userInfos from logininfo where uuid = ?'
        },
        selectComic: 'select * from comics where uuid = ?',
        insertComic: 'insert into comics(uuid,comicName,sourceName,innerName,sourceFile,postImg) values(?,?,?,?,?,?)',
        findComicName: 'select comicName from comics',
        logincheck: 'select * from logininfo where userinfos like ?',
        selectUserinfo: 'select * from userinfo where uuid=?',
        selectLogininfo: 'select * from logininfo where uuid=?',
        selectAllUser: 'select * from logininfo'
    },

    //检查登录信息
    check: (userstr) => {
        if (userstr.match(/^(pxtar)/)) {
            console.log("it's username");
            return true;
        } else if (userstr.match(/.*@.*/)) {
            console.log("it's email");
            return true;
        } else if (/^1[3|4|5|8][0-9]\d{8}$/.test(userstr)) {
            console.log("it's a phone");
            return true;
        } else return false;
    },
    //uuid生成
    uuid: () => {
        var s = [];
        var hexDigits = '0123456789abcdef';

        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr(s[19] & 0x3 | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    },
    //生成用户名
    userRandom: () => {
        var s = 'pxtar';
        var hexDigits = '0123456789';
        for (var i = 0; i < 6; i++) {
            s += hexDigits.substr(Math.floor(Math.random() * 10), 1);
        }
        return s;
    },
    //生成验证码
    checkNum: () => {
        var s = [];
        var hexDigits = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0; i < 6; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 62), 1);
        }
        return s.join("");
    },
    //更新配置文件
    newFile: (path, name, infos) => {
        let destination = path + '/' + name;
        fs.writeFileSync(destination, infos, (err) => {
            if (err)
                return console.error(err);
        });
        return true;
    },
    //新建资源文件夹
    newDir: (path, name) => {
        let destination = path + '/' + name;
        fs.exists(destination, (exist) => {
            if (!exist) {
                fs.mkdir(destination, (err) => {
                    if (err)
                        return console.error(err);
                });
            } else
                return true;
        });
        return true;
    },
    //汉字转拼音
    chToPy: (str) => {
        let temp = pinyin(str, {
            style: pinyin.STYLE_FIRST_LETTER,
            heteronym: true
        });
        let final = '';
        for (let i = 0; i < temp.length; i++) {
            final += temp[i].toString();
        }
        return final;
    },
};

module.exports = exports = utils;
