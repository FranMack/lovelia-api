const express=require("express");
const chatRouter=express.Router();
const { validateAuth } = require("../midlewares/auth");
const ChatControllers=require("../controllers/chat.controllers");


chatRouter.post("/set-chat",validateAuth,ChatControllers.storeChat)
chatRouter.get("/get-chat",validateAuth,ChatControllers.getAllChats)


module.exports=chatRouter;