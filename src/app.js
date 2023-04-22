import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"
import bcrypt from 'bcrypt';

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
    const passwordHash = bcrypt.hashSync(password,1)

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message)
        console.log(errors)
        return res.status(422).send(errors)
    }
    const existenUser = await db.collection("users").findOne({ email: email })
    if (existenUser) res.sendStatus(409)
    try {
        await db.collection("users").insertOne({ name, email, passwordHash })

        return res.sendStatus(201)
    } catch (error) {
        res.status(500).send(err.message)
    }
})

const PORT = 5000
app.listen(PORT, () => console.log(`tá rodando na pourtaaaaa :: ${PORT}`))