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

// Add headers before the routes are defined
app.use(function (req, res, next) {
    if (env == 'development') {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    // Pass to next layer of middleware
    next();
});

app.use('/api/user', require('./routes/api/user'))
app.use('/api/project', require('./routes/api/project'))
app.use('/projects', require('./routes/projects'))

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