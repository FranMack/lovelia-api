const express=require("express");
const alarmRouter=express.Router();
const { validateAuth } = require("../midlewares/auth");
const AlarmControllers=require("../controllers/alarm.controllers");


alarmRouter.post("/set-alarm",validateAuth,AlarmControllers.setAlarm)
alarmRouter.get("/get-alarm",validateAuth,AlarmControllers.getAlarm)


module.exports=alarmRouter;