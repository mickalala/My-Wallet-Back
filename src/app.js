import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid"

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL);
let db
mongoClient.connect().then(() => db = mongoClient.db())

const siginSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(3)
})



app.post("/cadastro", async (req, res) => {
    const { name, email, password } = req.body
    const validation = siginSchema.validate(req.body, { abortEarly: false })
    const passwordHash = bcrypt.hashSync(password, 1)

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message)
        console.log(errors)
        return res.status(422).send(errors)
    }
    const existenUser = await db.collection("users").findOne({ email: email })
    if (existenUser) res.sendStatus(409)
    try {
        await db.collection("users").insertOne({ name, email, password:passwordHash })

        return res.sendStatus(201)
    } catch (error) {
        res.status(500).send(err.message)
    }
})

app.post("/", async (req, res) => {
    const { email, password } = req.body
    const userSchema= joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const validation= userSchema.validate(req.body, {abortEarly:false})
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message)
        console.log(errors)
        return res.status(422).send(errors)
    }
    try {
        const user = await db.collection("users").findOne({ email })
        if (!user) return res.sendStatus(404)

        const rightPassword = bcrypt.compareSync(password, user.password)
        if (!rightPassword) return res.sendStatus(401)

        const token = uuid()
        await db.collection("sessoes").insertOne({ token, userId: user._id })
        res.status(200).send(token)
    } catch (error) {
        res.status(500).send(error.message)
    }


})

const PORT = 5000
app.listen(PORT, () => console.log(`tá rodando na pourtaaaaa :: ${PORT}`))