var express = require('express')
var expressSession = require('express-session')
const pgSession = require('connect-pg-simple')(expressSession);
const passport = require('passport');
const path = require('path')

const pg = require('pg');

var socket_io = require('./routes/socket_io.js')

var ejs = require('ejs');
ejs.delimiter = '$';

// Gives us access to the .env file for enviroment variables
require('dotenv').config()

var app = express();
var PORT = process.env.PORT || 5000
var env = process.env.NODE_ENV || 'development';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/dist')));
app.use(express.urlencoded({ extended: true }));

// Setup database session store
app.use(expressSession({
    store: new pgSession({
        // Insert connect-pg-simple options here
        conString: process.env.DATABASE_URL
      }),
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 30 days
    resave: false
}));

require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())


app.use(express.json())

app.use('/api/user', require('./routes/user'))
app.use('/', require('./routes/registration'))
app.use('/projects/join', socket_io.router)

// app.get('/projects', (req, res, next) => {
//     console.log(req.isAuthenticated())
//     if (req.isAuthenticated()) {
//         next()
//     } else {
//         res.redirect('/login')
//     }
// })

// app.get('/', require('./routes/main'));

app.get(/.*/, vue_route);

function vue_route(req, res) {
    var pagedata = {
        'title': 'Build Networks Online',
        'user': null,
    };

    var userData = req.user
    if (userData) {
        delete userData['id'];
        delete userData['password'];
        delete userData['salt'];
        console.log(userData)
        pagedata['user'] = JSON.stringify(userData)
    }
    
    res.render(path.join(__dirname, '/dist/index.ejs'), pagedata);
}


function errorHandler(err, req, res, next) {
    if (err && env !== 'development') {
        res.send(`
            <h1>There was an error, please try again.</h1>
        `)
    } else {
        res.send(`
            <h1>There was an error, please try again.</h1>
            <p>${err}</p>
        `)
    }
}
app.use(errorHandler)

var server = app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});


socket_io.setup_socket_io(server);