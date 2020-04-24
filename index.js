var express = require('express');
var defaultProjects = require('./assets/js/defaultProjects.js');
var app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

app.get('/', function (req, res) {
    var pagedata = {
        'title': 'FrontPage',
        'navExpand': 'show',
    };
    res.render('frontpage', {pagedata:pagedata});
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



app.listen(5000, () => {
    console.log("The server is now running on port 5000!");
});