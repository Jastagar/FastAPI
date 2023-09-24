const {info}=require("../utils/logger")

const router = require("express").Router()

router.get("/",async (_,res) =>{
    info("Everything is good to go !!")
    res.status(200).json({
        message:"Hello World"
    })
})

module.exports = router