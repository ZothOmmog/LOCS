let User = require("../models/userlist.js");
const path = require('path')
    //const { body, validationResult } = require('express-validator');
    //const { sanitizeBody } = require('express-validator');
let pgp = require("pg-promise")( /*options*/ );
let db = pgp("postgres://postgres:123@localhost:5432/LocsBD_Dev");

const session = require('express-session');


exports.create = function(request, response) {
    if (request.session.user_id_log != null & request.session.user_role == 2) {
        response.sendFile(path.resolve('static/html/event_form.html'))
    } else {
        //тут помжно добавить ссылку на форму, чтобы user стал organizer
        console.log("Переход на страницу login");
        response.redirect("/user/login");
    }
};