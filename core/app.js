const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('../core/config.json');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
const hbs = require('hbs');
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('formatNumber', function(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});
hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

app.enable('trust proxy');
app.use(favicon(path.join(__dirname,'../public', '/images/Favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

APIKey = config.API.Key
app.use((req, res, next) => {
    req.APIKey = APIKey;
    req.isOnlyLetters = function(text) {
        var letters = /^[A-Za-z]+$/;
        if (text.match(letters)) {
          return true;
        }
        else {
          return false;
        }
    };
    req.checkEmail = function(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    req.checkCharacters = function(text) {
        var re = /[\'\"\/\\`]/;
        return re.test(text);
    };
    next();
});

const index = require('../routes/index'); app.use('/', index);
//const Minecraft = require('../routes/Minecraft'); app.use('/Minecraft', Minecraft);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.render('error', { error: err, message: err.message });
});

module.exports = app;