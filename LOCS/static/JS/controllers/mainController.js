const path = require('path')


exports.mainPage = function(request, response) {
    if (request.session.user_id_log) {
        response.sendFile(path.resolve('static/html/map.html'));
    } else {
        response.sendFile(path.resolve('static/html/map.html'));
    }
};