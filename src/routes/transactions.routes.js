import { Router } from "express";
import { transaction,showTransactions } from "../controllers/transaction.controllers.js";

const transRouter= Router()

transRouter.post("/nova-transacao/:tipo", transaction)
transRouter.get("/home", showTransactions)

export default transRouter