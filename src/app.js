import express from "express"
import cors from "cors"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import transRouter from "./routes/transactions.routes.js"
import cookieParser from "cookie-parser"
const app = express()
app.use(cookieParser)

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

app.use(authRouter)
app.use(transRouter)

app.listen(process.env.PORT, () => console.log(`tá rodando na pourtaaaaa :: ${process.env.PORT}`))