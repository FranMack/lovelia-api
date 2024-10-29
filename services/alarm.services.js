const {User,Alarm}=require("../models/index.models")
class AlarmServices{

    static async setAlarm(data,id){

        try{
            const user= await User.findById(id);
            if(!user){
                throw new Error ("User not found")
            }

              // Si la alarma ya existe, la actualiza. Si no, la crea (con upsert)
        const updatedAlarm = await Alarm.updateOne(
            { user_id: id },               // Filtro
            { $set: { ...data, user_id: id } },  // Actualización
            { upsert: true, runValidators: true } // Crear si no existe y validar
        );

        // Puedes retornar el resultado de la actualización
        return updatedAlarm;

        }

        catch(error){
            console.log(error)
            throw error;
        }
    }


    static async getAlarm(id){

        try{
    
            const user= await User.findById(id);
            if(!user){
                throw new Error ("User not found")
            }

            const alarm = await Alarm.findOne({user_id:id});

            if(!alarm){
                return{
                    alarm1:"",
                     alarm2:"",
                      alarm3:"",
                       alarm4:"",
                       sound:""
                }
            }

            return alarm

    

        }

        catch(error){
            console.log(error)
            throw error;
        }
    }
}

module.exports=AlarmServices;