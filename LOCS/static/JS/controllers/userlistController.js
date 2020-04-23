let User = require("../models/userlist.js");
const path = require('path')
let crypt = require("../scripts/password.js");
let tokensUsers = new Map();
var config = require('../configs/config.json');
var DataBase = require('../scripts/DataBase.js');


exports.postRegistration = async function(request, response) {
    var CreateTime;
    var CheckMail = false;
    var CheckNick = false;

    await DataBase.CheckUser(request.body.Registration.mail).then(function(val) {
        CheckMail = val;
    });


    await DataBase.CheckNick(request.body.Registration.nick).then(function(val) {
        CheckNick = val;
    });

    if (CheckMail == true & CheckNick == true) {
        await DataBase.TimeNow().then(function(val) {
            CreateTime = val;
        });
        if (!CreateTime) {
            response.json({
                "Login": {
                    "NickNameFlag": CheckNick,
                    "MailFlag": CheckMail
                }
            });
        }

        var hash = crypt.hash(request.body.Registration.pas, CreateTime);
        let checkAdd = false;
        await DataBase.AddUser(request.body.Registration.nick, request.body.Registration.mail, hash, "User", 1, CreateTime).then(function(val) {
            checkAdd = val;
        });
        if (!checkAdd) {
            response.json({
                "Login": {
                    "NickNameFlag": false,
                    "MailFlag": false
                }
            });
        }

        response.json({
            "Login": {
                "NickNameFlag": CheckNick,
                "MailFlag": CheckMail
            }
        });


    } else {
        //отвечаем, что данные не корректны 
        response.json({
            "Login": {
                "NickNameFlag": CheckNick,
                "MailFlag": CheckMail
            }
        });
    }

};

exports.postLogin = async function(request, response) {
    var UserId;
    var salt = "";
    await DataBase.DateCreate(request.body.Login.mail).then(function(val) {
        salt = val;
    });

    console.log(salt);
    if (!salt) {
        response.json({
            "Login": {
                "Flag": false
            }
        });
    }

    var hash = crypt.hash(request.body.Login.pas, salt);

    await DataBase.LogUser(request.body.Login.mail, hash).then(function(val) {
        UserId = val;
    });

    console.log(UserId);

    if (UserId == -1) {
        //неправильные данные для входа
        response.json({
            "Login": {
                "Flag": false
            }
        });

    } else {

        //request.session.user_id_log = UserId;
        var Role;

        await DataBase.RoleUser(UserId).then(function(val) {
            Role = val;
        });

        if (!Role) {
            response.json({
                "Login": {
                    "Flag": false
                }
            });
        }
        console.log(Role);
        request.session.user_role = Role;

        const hashId = crypt.hash(UserId, hash); //сделай вторым аргументом что-нибудь другое, наверно.
        tokensUsers.set(hashId, UserId);

        response.cookie('userId', hashId, { maxAge: config.cookieLive }).json({
            "Login": {
                "Flag": true
            }
        });
    }
};

exports.acc = async function(request, response) {
    const userId = request.cookies.userId ? tokensUsers.get(request.cookies.userId) : undefined;
    //console.log(userId);
    if (userId) {
        var masData;
        await DataBase.DataUserAccount(userId).then(function(val) {
            masData = val;
        });
        if (!masData) {
            response.json({
                "User": {
                    "Mail": "",
                    "Nick": "",
                    "City": "",
                    "UrlPicture": "",
                    "Auth": false
                }
            });
        }
        let UserMail = masData[0];
        let UserNickname = masData[1];
        let UserPicture = masData[2];
        let UserCity = masData[3];

        response.json({
            "User": {
                "Mail": UserMail,
                "Nick": UserNickname,
                "City": UserCity,
                "UrlPicture": UserPicture,
                "Auth": true
            }
        });
    } else {
        //Переход на страницу login
        response.json({
            "User": {
                "Mail": "",
                "Nick": "",
                "City": "",
                "UrlPicture": "",
                "Auth": false
            }
        });
    }
};

exports.logout = function(request, response) {

    request.session.destroy((err) => {
        if (err) {
            console.log(err);
            response.json({
                "logout": false
            });
        }
        response.json({
            "logout": true
        });
    });
};

exports.searchUser = async function(request, response) {
    const userId = request.cookies.userId ? tokensUsers.get(request.cookies.userId) : undefined;
    if (userId) {
        var data;

        await DataBase.datauserlist(request.body.nick).then(function(val) {
            data = val;
        });

        console.log(request.body.nick)
        console.log(data)

        if (!data) {
            response.json([{
                "user": {
                    "id_user": 0,
                    "nickname": "not found"
                }
            }, ]);
        } else {
            response.json(data);
        }
    } else {
        response.json([{
            "user": {
                "id_user": -1,
                "nickname": "user dont sing in"
            }
        }, ]);
    }
};


exports.friendList = async function(request, response) {
    const userId = request.cookies.userId ? tokensUsers.get(request.cookies.userId) : undefined;
    if (userId) {
        var data;
        await DataBase.friendList(userId).then(function(val) {
            data = val;
        }).catch(function(er) {
            response.json({ err: "#" + er });
        });

        response.json(data);
    } else {
        response.json({ err: "user dont sing in" });
    }
};