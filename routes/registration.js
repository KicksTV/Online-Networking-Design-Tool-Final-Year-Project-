
const router = require("express").Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword
const { PrismaClient } = require("@prisma/client")

const { user } = new PrismaClient()

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/projects' }))

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/')
    })
})

router.post('/register', async (req, res, next) => {
    const { username, email } = req.body;
    console.log(req.body, username, email, req.body.password)
    try {
        const saltHash = genPassword(req.body.password)

        const salt = saltHash.salt
        const hash = saltHash.hash

        const newUser = await user.create({
            data: {
                username: username,
                password: hash,
                salt: salt,
                email: email
            }
        })

        console.log(newUser)

        res.redirect('/login')
    } catch(e) {
        throw e; 
    }
})

module.exports = router
