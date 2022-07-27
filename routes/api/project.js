const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()


router.get('/:username', async (req, res) => {
    var projects = null
    if (req.params.username == req.user.username) {
        var username = req.params.username
        projects = await prisma.user.findUnique({
            where: {
                username: username,
            },
            select: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        createdAt: true,
                        updatedAt: true,
                        json: true,
                    },
                },
            }
        })
    }
    res.json(projects)
})

router.get('/:projectSlug', async (req, res) => {
    var project = await getProject({slug: req.params.projectSlug})
    if (project) {
        return res.json(project)
    } else {
        res.json({error: 'Could not find project!'})
    }
})

async function getProject(uniqueProjectData) { // uniqueProjectData (object) can be ID or SLUG
    async function func(uniqueProjectData) {
        try {
            const foundProject = await prisma.project.findUnique({where: uniqueProjectData})
            console.log(foundProject)
            return foundProject
        } catch(e) {
            console.log(e)
            return
        }
    }
    var foundProject = await func(uniqueProjectData).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })

    return foundProject
}

async function updateProject(req, res) {
    try {
        const p = req.body.project;
        if (req.params.username == req.user.username) {
            var user = req.user,
                settings = p.settings

            const newProject = await prisma.project.update({
                data: {
                    name: settings.name,
                    updatedAt: new Date(),
                    json: p
                },
                where: {
                    id: settings.id
                }
            })
            res.json(newProject)
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            msg: `Error creating project: ${e}`
        })
    }
}

async function createProject(req, res) {
    try {
        const p = req.body.project;
        if (req.params.username == req.user.username) {
            var user = req.user,
                settings = p.settings;

            if (!settings.slug) {
                // use name as slug
                settings.slug = settings.name.replace(' ', '-').toLowerCase();
            }
            const newProject = await prisma.project.create({
                data: {
                    name: settings.name,
                    slug: settings.slug,
                    userID: user.id,
                    updatedAt: new Date(),
                    json: p
                }
            })
            res.json(newProject)
        }
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            msg: `Error creating project: ${e}`
        })
    }
}

async function saveProject(req, res) {

    if (req.params.username == req.user.username) {
        // First get project to see if we need to create it or update it.
        console.log(req.body.project.settings.id)
        var p;
        if (req.body.project.settings.id) {
            var uniqueData = { id: req.body.project.settings.id }
            p = await getProject(uniqueData)
            if (p) {
                // update it
                await updateProject(req, res)
            } else {
                // create it
                await createProject(req, res)
            }
        } else {
            // create it
            await createProject(req, res)
        }
    }

}

router.post('/:username/', async (req, res) => {
    saveProject(req, res).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })
})

module.exports = router
module.exports.getProject = getProject