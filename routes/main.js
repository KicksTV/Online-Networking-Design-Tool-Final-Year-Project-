const router = require("express").Router();
const path = require('path')


router.get(/.*/, function (req, res) {
    console.log("main")
    var pagedata = {
        'title': 'Build Networks Online'
    };
    res.sendFile('/dist/index.html');
});

module.exports = router