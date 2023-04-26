import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import { cadastro,login } from "./controllers/auth.controllers.js"
import { transaction, showTransactions } from "./controllers/transaction.controllers.js"
const app = express()

app.use(cors())
app.use(express.json())
dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
    await mongoClient.connect()

} catch (err) {
    console.log(err.message)
}
export const db = mongoClient.db()

app.post("/cadastro", cadastro)

app.post("/", login)

app.post("/nova-transacao/:tipo", transaction)

app.get("/home", showTransactions)

app.listen(process.env.PORT, () => console.log(`tá rodando na pourtaaaaa :: ${process.env.PORT}`))