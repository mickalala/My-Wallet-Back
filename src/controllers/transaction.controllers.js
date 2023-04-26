import { db } from "../app.js"
import joi from "joi"

export async function transaction(req, res) {
    const { value, description, type } = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")


    if (!token) return res.sendStatus(401)

    const transactionScheme = joi.object({
        value: joi.number().positive().required(),
        description: joi.string().required(),
        type: joi.any().valid(':entrada', ':saida').required()
    })
    const validation = transactionScheme.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message)
        console.log(errors)
        return res.status(422).send(errors)
    }

    await db.collection("transactions").insertOne({ value, description, type })
    res.sendStatus(200)
}

export async function showTransactions(req, res) {

    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")

    if (!token) return res.sendStatus(401)

    try {
        const {userId} = res.locals.sessoes;
        console.log(userId)
        const transactions = await db.collection("transactions").find().toArray()
        res.send(transactions)
    } catch (error) {
        res.status(500).send(error.message)
    }
}