const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

const {aws_upload_file} = require('../../lib/awsUtils')


async function getTask(uniqueTaskData) { // uniqueProjectData (object) can be ID or SLUG
    async function func(uniqueTaskData) {
        try {
            console.log("uniqueTaskData", uniqueTaskData)
            const foundTask = await prisma.task.findUnique({where: uniqueTaskData})
            console.log("foundTask", foundTask)
            return foundTask
        } catch(e) {
            console.log(e)
            return
        }
    }
    var foundTask = await func(uniqueTaskData).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })

    return foundTask
}

async function updateTask(req, res) {
    console.log("updateTask")
    try {
        const t = req.body.task;
        console.log(t)
        // var mod = {id:t.module_id}
        // if (t.module_slug)
        //     mod = await prisma.module.findUnique({where: {slug: t.module_slug}, select: {id: true}})
        const updatedTask = await prisma.task.update({
            data: {
                slug: t.slug,
                name: t.name,
                description: t.description,
                updatedAt: new Date(),
            },
            where: {
                id: Number.parseInt(t.id),
            }
        })
        res.json(updatedTask)
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            msg: `Error creating project: ${e}`
        })
    }
}

async function createTask(req, res) {
    try {
        const t = req.body.task;
        console.log(t)
        if (t.slug) {
            // use name as slug
            t.slug = t.name.replace(' ', '-').toLowerCase();
        }
        if (t.module_slug)
            mod = await prisma.module.findUnique({where: {slug: t.module_slug}, select: {id: true}})
        else {
            return res.status(500).json({
                msg: `Error creating project: Missing module data`
            })
        }

        // they have provided validation code, then save in s3
        var s3_url = ''
        if (t.code) {
            s3_url = `${mod.slug}/${t.slug}/validation.js`
            var msg = aws_upload_file(s3_url, t.code)
            console.log(msg)
        }

        const newTask = await prisma.task.create({
            data: {
                slug: t.slug,
                name: t.name,
                description: t.description,
                moduleID: mod.id,
                validation_code_url: s3_url
            }
        })

        
        res.json(newTask)
    } catch(e) {
        console.log(e)
        return res.status(500).json({
            msg: `Error creating project: ${e}`
        })
    }
}

async function saveTask(req, res) {
    var t;
    console.log(req.body.task)
    if (req.body.task.id) {
        var uniqueData = {}

        if (req.body.task.id)
            uniqueData['id'] = Number.parseInt(req.body.task.id)
        // if (req.body.task.module_id)
        //     uniqueData['Module'] = {id: Number.parseInt(req.body.task.module_id)}
        
        if (uniqueData)
            t = await getTask(uniqueData)

        console.log(uniqueData, t)
        if (t) {
            console.log("edit", hasEditAccess(req, res, t))
            if (hasEditAccess(req, res, t) || req.user.isAdmin) {
                await updateTask(req, res)
            }
        } else {
            if (hasCreationAccess(req, res)) {
                await createTask(req, res)
            }
        }
    } else {
        if (hasCreationAccess(req, res)) {
            await createTask(req, res)
        } else {
            console.log(e)
            return res.status(500).json({
                msg: `You do NOT have the correct access rights to create or edit a module!`
            })
        }
    }
}

function hasEditAccess(req, res, t) {
    // Go through roles to find teachers
    for (role in t.roles) {
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

router.post('/:username', async (req, res) => {
    saveTask(req, res).catch((e) => {
        throw e
    }).finally(async () => {
        await prisma.$disconnect()
    })
})

router.get('/all/', async (req, res) => {
    var tasks = null
    tasks = await prisma.task.findMany()
    // console.log("modules", tasks)
    return res.json(tasks)
})

router.get('/:username', async (req, res) => {
    var tasks = null
    if (req.params.username == req.user.username) {
        var username = req.params.username
        tasks = await prisma.user.findUnique({
            where: {
                username: username,
            },
            select: {
                tasks: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        tasks: true,
                    },
                },
            }
        })
    }
    res.json(modules)
})

router.get('/:taskSlug', async (req, res) => {
    var task = await getModule({slug: req.params.taskSlug})
    if (task) {
        return res.json(task)
    } else {
        res.json({error: 'Could not find project!'})
    }
})



module.exports = router
module.exports.getTask = getTask