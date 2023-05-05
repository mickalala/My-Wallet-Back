import { db } from "../app.js"
import joi from "joi"
import bcrypt from 'bcrypt'
import { v4 as uuid } from "uuid"

const siginSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required().min(3)
})

export async function cadastro(req, res) {
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
        await db.collection("users").insertOne({ name, email, password: passwordHash })
        res.cookie("lala esse é o nome","agora o value")
        return res.sendStatus(201)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function login(req, res) {
    const { email, password } = req.body
    const userSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    })
    const validation = userSchema.validate(req.body, { abortEarly: false })
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message)
        console.log(errors)
        return res.status(422).send(errors)
    }
    try {
        const user = await db.collection("users").findOne({ email })
        if (!user) return res.status(404).send("email não encontrado!")

        const rightPassword = bcrypt.compareSync(password, user.password)
        if (!rightPassword) return res.status(401).send("senha incorreta!")

        const token = uuid()
        await db.collection("sessoes").insertOne({ token, userId: user._id })
        res.status(200).send(token)
    } catch (error) {
        res.status(500).send(error.message)
    }
}