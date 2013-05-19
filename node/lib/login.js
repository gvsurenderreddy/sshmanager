var mongodb = require('mongodb');

var server = new mongodb.Server("127.0.0.1", 27017, {});
var client = new mongodb.Db('admin', server, {});

var request, response, result;
function UserLogin() {}

UserLogin.prototype.checkVcode = function() {
   
    var rawcode = request.session.verifycode,
        usercode = request.body.maxma.toLowerCase();
    return rawcode === usercode;
};

UserLogin.prototype.checkUser = function(callback) {
    this.findUser(function(docs) {
        if (docs.length < 1) {
            result.ret = false;
            result.errinfo = '没用该用户！';
        }else if (docs.password !== request.body.iori) {
            result.ret = false;
            result.errinfo = '密码错误';
        }
        callback();
        client.close();
    });
};

UserLogin.prototype.findUser = function(callback) {
    client.open(function (error, client) {
        if (error) throw error;
        var collection = new mongodb.Collection(client, 'sshdb');
        var username = request.body.kusanagi;
        collection.find({user: username}).toArray(function(err, docs) {
            callback(docs);
        });
    });
}

var userLogin = new UserLogin();

module.exports = function(req, res) {
    request = req;
    response = res;
    result = {
        ret: true,
        errinfo: ''
    };

    if (!userLogin.checkVcode(req)) {
        result.ret = false;
        result.errinfo = '验证码错误';
        sendResponses();
        return;
    }

    userLogin.checkUser(function() {
        sendResponses();
    });
    
}

function sendResponses() {
    response.set('Content-Type', 'application/json');
    response.send(result);
}