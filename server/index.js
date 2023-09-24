require("dotenv").config()
const http = require("http")
const express = require("express")
const cors = require("cors")
const router=require("./routers/router")
const {info}=require("./utils/logger")
const mongoose =require("mongoose")
const authRoute=require("./routers/authRoute")

const app = express()

app.use(express.json())
const PORT = process.env.PORT || 3001
const server = http.createServer(app)

mongoose.connect(process.env.MONGO_DATABASE).then(()=>{
    info("Connected to DataBase")
})

app.use(cors())
app.use("/",router)
app.use("/auth",authRoute)

server.listen(PORT,()=>{
    info("listening on port:",PORT)
})