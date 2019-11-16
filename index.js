// const http = require('http');
// const path = require('path');
// const url = require('url');
// const fs = require('fs');

// const server = http.createServer((req, res) => {


//     let file;
//     if (req.url === '/') {
//         file = 'frontpage.html';
//     }
//     else if (req.url === '/login') {
//         file = 'login.html';
//     }
//     else if (req.url === '/projects') {
//         file = 'projects.html';
//     }
//     else if (req.url === '/project/newproject') {
//         file = 'newproject.js';
//     }
//     else {
//         file = req.url.replace("");
//     }

//     console.log(file);

//     // Build file path
//     let filePath = path.join(__dirname, 'Views', file);


//     // Extension of file
//     let extname = path.extname(filePath);

//     // Initial content type
//     let contentType = 'text/html';

//     // Check ext and set content type
//     switch(extname) {
//         case '.js':
//             contentType = 'text/javascrpt';
//             break;
//         case '.css':
//             contentType = 'text/css';
//             break;
//         case '.json':
//             contentType = 'application/json';
//             break;
//         case '.png':
//             contentType = 'image/png';
//             break;
//         case '.jpg':
//             contentType = 'image/jpg';
//             break;
//         case '.svg':
//             contentType = 'image/svg+xml';
//             break;

//     }

//     // Read file
//     fs.readFile(filePath, (err, content) => {
//         //let filename = path.basename(req.url).split(".");
//         if (err) {
//             if (err.code == 'ENOENT') {
//                 // Page not found
//                 fs.readFile(path.join(__dirname, 'Views', '404.html'), (err, content) => {
//                     //res.url = filename;
//                     res.writeHead(200, {'Content-Type': 'text/html'});
//                     res.end(content, 'utf8');
//                 });
//             } else {
//                 // Some server error
//                 res.writeHead(500);
//                 res.end(`Server Error: ${err.code}`);
//             }
//         } else {
//             // Success
//             //res.url = filename;
//             res.writeHead(200, {'Content-Type': contentType});
//             res.end(content, 'utf8');
//         }
//     });

// });

// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


var express = require('express');
var defaultProjects = require('./assets/js/defaultProjects.js');

var app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

app.get('/', function (req, res) {
    var pagedata = {
        'title': 'FrontPage'
    };
    res.render('frontpage', pagedata);
});
app.get('/projects', function (req, res) {
    var user;
    var pagedata = {
        'title': 'Projects',
        'navExpand': 'show',
    };
    res.render('projects', {pagedata:pagedata, user:user, defaultProjects: defaultProjects});
});
app.get('/projects/newproject', function (req, res) {
    var user;
    var pagedata = {
        'title': 'New Project',
        'navExpand': '',
    };
    res.render('newproject', {pagedata:pagedata, user:user});
});



app.listen(5000);