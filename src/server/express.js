var express = require('express');
var socket = require('socket.io');
const serveIndex = require('serve-index');
var defaultProjects = require('../../src/javascript/defaultProjects');
const path = require('path');


var app = express();

// WEBPACK
const webpack = require("webpack");
const config = require("../../config/webpack.dev.js");
const compiler = webpack(config);
const webpackDevMiddleware = require("webpack-dev-middleware")(
    compiler,
    config.devServer
);
const webpackHotMiddleware = require("webpack-hot-middleware")(compiler);
app.use(webpackDevMiddleware)
app.use(webpackHotMiddleware)
const staticMiddleware = express.static("assets");
app.use(staticMiddleware);

// app.set('view engine', 'ejs');

app.use('/assets', serveIndex(path.join(__dirname, '/assets')));


app.get('/', function (req, res) {
    var pagedata = {
        'title': 'FrontPage',
        'navExpand': 'show',
    };
    res.send(`
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <!-- <meta http-equiv="X-UA-Compatible" content="ie=edge"> -->
                <title></title>
            </head>
        <body>
            <nav class="navbar navbar-dark bg-dark" style="justify-content: space-between;">
                <a class="navbar-brand text-white">Online Networking Design Tool</a>
                <div class="form-inline">
                    <button class="navbar-toggler" style="padding: .25rem .5rem;font-size: .875rem;" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
                
                <div class="collapse navbar-collapse <%= pagedata.navExpand %>" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto" style="flex-direction: row;">
                        <li class="nav-item active">
                            <a class="nav-link" href="/projects">Projects <span class="sr-only">(current)</span></a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#">How to use</a>
                        </li>
                    </ul>
                </div>
            </nav>
            <script src="bundle.js"></script>
        </body>
        </html>

    `);
});
// app.get('/projects', function (req, res) {
//     var user;
//     var pagedata = {
//         'title': 'Projects',
//         'navExpand': 'show',
//     };
//     res.render('projects', {pagedata:pagedata, user:user, defaultProjects: defaultProjects});
// });
// app.get('/projects/newproject', function (req, res) {
//     var user;
//     var pagedata = {
//         'title': 'New Project',
//         'navExpand': '',
//     };
//     res.render('newproject', {pagedata:pagedata, user:user});
// });



var server = app.listen(3000, () => {
    console.log("The server is now running on port 8080!");
});

// let io = socket.listen(server);

// io.sockets.on('connection',
//     function (socket) {
//         console.log("We have a new client: " + socket.id);
    
//         socket.on('disconnect', function() {
//             console.log("Client has disconnected");
//         });


//         socket.on('mouse',
//             function(data) {
//             // Data comes in as whatever was sent, including objects
//             console.log("Received: 'mouse' " + data.x + " " + data.y);      
//             // Send it to all other clients
//             socket.broadcast.emit('mouse', data);
//             }
//         );  
//     }
// );

