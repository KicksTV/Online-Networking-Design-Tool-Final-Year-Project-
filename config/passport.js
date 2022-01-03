const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require("@prisma/client")
const validPassword = require('../lib/passwordUtils').validPassword

const { user } = new PrismaClient()

const verifyCallback = (username, password, done) => {
    user.findUnique({username})
        .then((user)=> {
            console.log(user)
            if (!user) { return done(null, false) }

            const isValid = validPassword(password, user.hash, user.salt)

            if (isValid) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        }).catch((err) => {
            console.log(err)
            done(err)
        });
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((userID, done) => {
    user.findUnique({id: userID})
        .then((user)=> {
            return done(null, user)
        .catch(err => done(err))
    })
})