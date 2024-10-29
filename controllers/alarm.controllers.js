const AlarmServices =require("../services/alarm.services")
class AlarmControllers{

    static async setAlarm (req,res){
        const data=req.body;
        const {id}=req.user;
        try{

            const newAlarm= await AlarmServices.setAlarm(data,id)
res.status(200).json(newAlarm)

        }

        catch (error) {
            if (error.response) {
              res.status(error.response.status).json({ error: error.message });
            } else {
              res.status(400).json({ error: error.message });
            }
          }
}

static async getAlarm (req,res){
  const {id}=req.user;
  try{

      const alarm= await AlarmServices.getAlarm(id)
res.status(200).json(alarm)

  }

  catch (error) {
      if (error.response) {
        res.status(error.response.status).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
}


}

module.exports=AlarmControllers