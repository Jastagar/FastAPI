require("dotenv").config()
const http = require("http")
const express = require("express")
const cors = require("cors")
// const router=require("./routers/router")
const {info}=require("./utils/logger")
// const mongoose =require("mongoose")

const app = express()

app.use(express.json())
app.use(express.static('build'));

const PORT = process.env.PORT || 3001
const server = http.createServer(app)

// mongoose.connect(process.env.MONGO_DATABASE).then(()=>{
//     info("Connected to DataBase")
// })

app.use(cors())

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});

server.listen(PORT,()=>{
    info("listening on port:",PORT)
})