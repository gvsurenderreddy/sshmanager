var express = require('express'),
    kaptcha = require('./lib/kaptcha'),
    login = require('./lib/login');

var app = express();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({key: '_vcode', secret: "sshm"}));

(function() {

    app.get('/kaptcha', function(req, res, next) {
        kaptcha(req, res);
    });

    app.post('/login', function(req, res, next) {
        login(req, res);
    });

    
})();

app.listen(3000);



    
