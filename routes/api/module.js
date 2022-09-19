const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()


async function getModule(uniqueModuleData) { // uniqueProjectData (object) can be ID or SLUG
    async function func(uniqueModuleData) {
        try {
            const foundModule = await prisma.project.findUnique({where: uniqueModuleData})
            console.log(foundModule)
            return foundModule
        } catch(e) {
            console.log(e)
            return
        }
    }
    var foundModule = await func(uniqueModuleData).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })

    return foundModule
}

async function updateModule(req, res) {
    try {
        const m = req.body.module;
        const updatedModule = await prisma.module.update({
            data: {
                slug: m.slug,
                name: m.name,
                description: m.description,
            },
            where: {
                id: m.id
            }
        })
        res.json(updatedModule)
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            msg: `Error creating project: ${e}`
        })
    }
}

async function createModule(req, res) {
    try {
        const m = req.body.module;
        if (m.slug) {
            // use name as slug
            m.slug = m.name.replace(' ', '-').toLowerCase();
        }
        const newModule = await prisma.module.create({
            data: {
                slug: m.slug,
                name: m.name,
                description: m.description,
            }
        })
        res.json(newModule)
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            msg: `Error creating project: ${e}`
        })
    }
}

async function saveModule(req, res) {
    var m;
    if (req.body.module.id) {
        var uniqueData = { id: req.body.module.id }
        m = await getModule(uniqueData)

        if (m) {
            if (hasEditAccess(req, res, m)) {
                await updateModule(req, res)
            }
        } else {
            if (hasCreationAccess(req, res)) {
                await createModule(req, res)
            }
        }
    } else {
        if (hasCreationAccess(req, res)) {
            await createModule(req, res)
        } else {
            console.log(e)
            return res.status(500).json({
                msg: `You do NOT have the correct access rights to create or edit a module!`
            })
        }
    }
}

function hasEditAccess(req, res, m) {
    // Go through roles to find teachers
    for (role in m.roles) {
        // if role is a teacher and matches logged in user
        if (role.user.isTeacher && role.user.username == req.user.username) {
            return true
        }
    }
    return false
}

function hasCreationAccess(req, res) {
    return req.user.isTeacher || req.user.isAdmin
}


router.post('/:username/', async (req, res) => {
    saveModule(req, res).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })
})

router.get('/all/', async (req, res) => {
    var modules = null
    modules = await prisma.module.findMany()
    console.log("modules", modules)
    return res.json(modules)
})

router.get('/:username', async (req, res) => {
    var modules = null
    if (req.params.username == req.user.username) {
        var username = req.params.username
        modules = await prisma.user.findUnique({
            where: {
                username: username,
            },
            select: {
                modules: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        tasks: true,
                    },
                },
            }
        })
    }
    res.json(modules)
})

router.get('/:moduleSlug', async (req, res) => {
    var module = await getModule({slug: req.params.moduleSlug})
    if (module) {
        return res.json(module)
    } else {
        res.json({error: 'Could not find project!'})
    }
})



module.exports = router
module.exports.getModule = getModule