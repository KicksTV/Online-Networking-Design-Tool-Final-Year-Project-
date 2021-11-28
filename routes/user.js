const router = require("express").Router();
const { PrismaClient } = require("@prisma/client")

const { user } = new PrismaClient()

router.get('/', async (req, res) => {
    const users = await user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            projects: true,
        }
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const usernameExists = await user.findUnique({
            where: {
                username: username,
            },
            select: {
                username: true,
            }
        })
        const userEmailExists = await user.findUnique({
            where: {
                email,
            },
            select: {
                email: true,
            }
        })
        // res.json(userExists)
        if (usernameExists || userEmailExists) {
            return res.status(400).json({
                msg: "User already exists!"
            })
        }
        const newUser = await user.create({
            data: {
                username: username,
                password: password,
                email: email
            }
        })
        res.json(newUser)
    } catch(e) {
        return res.status(500).json({
            msg: "Error creating user!"
        })
    }
})

module.exports = router