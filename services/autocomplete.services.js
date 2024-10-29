const { envs } = require("../config/env.config");
const axios = require("axios");
class AutoCompleteServices{

    static async getListOfPlaces(input){

        try{


            const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${envs.GOOGLE_GEOCODING_KEY}`;

            const response = await axios.get(url);

            const predictions=response.data.predictions.filter((item)=>{
              if(item.types.includes("locality")){
                return item.description
              }
            })
            const localities=predictions.map((item)=>{
                return item.description
            })


            return localities
         

        }

        catch (error) {
            console.log(error);
            throw error;
          }
    }
}

module.exports=AutoCompleteServices;