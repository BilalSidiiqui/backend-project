const express=require("express");
const route=express.Router();

route.get("/",async(req,res)=>{
    console.log("Api")
    res.send("Api")
})
module.exports=route;