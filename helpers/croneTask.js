const cron=require("cron");
const {CronJob}=cron;
const {Alarm}=require("../models/index.models")




function croneTask(){

    const job = new CronJob(
        '0 */1 * * * *', // cronTime
        async function () {
          // const alarms= await Alarm.find({alarm4:""})


          const alarms = await Alarm.find({alarm_active:true});

        console.log(alarms)
        


        }, // onTick
        null, // onComplete
        true, // start
        'America/Los_Angeles' // timeZone
    );
    
    
    
    job.start()

return job
}


module.exports={croneTask};