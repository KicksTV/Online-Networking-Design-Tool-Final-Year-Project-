
const router = require("express").Router();
const passport = require('passport');
const genPassword = require('../lib/passwordUtils').genPassword
const { PrismaClient } = require("@prisma/client")

const { user } = new PrismaClient()

router.post('/login', passport.authenticate('local'), (req, res, next) => {})

router.post('/register', async (req, res, next) => {
    const { username, email } = req.body;
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
})
