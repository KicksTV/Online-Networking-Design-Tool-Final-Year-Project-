const router = require("express").Router();
const path = require('path')
var request = require('request')
const getProject = require('./api/project').getProject


// router.get('/projects', function (req, res) {
//     var pagedata = {
//         'title': 'Build Networks Online'
//     };
//     res.sendFile('/dist/index.html');
// });

router.get('/newproject/', function (req, res) {
    var pagedata = {
        'title': 'Build Networks Online'
    };
    res.render(path.join(__dirname, '../dist/index.ejs'), {'pagedata':pagedata});
});


router.get('/:projectSlug/', async (req, res) => {
    var pSlug = req.params.projectSlug
    //call the api with the video Id here somehow, and get title key for the video object below
    var project = await getProject({slug: pSlug})

    var pagedata = {
        'title': 'Build Networks Online',
        'project': project
    }
    res.render(path.join(__dirname, '../dist/index.ejs'), {'pagedata':pagedata});
})

module.exports = router