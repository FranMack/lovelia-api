const AutoCompleteServices=require("../services/autocomplete.services")
class AutoCompleteControllers{

    static async getListOfPlaces(req,res){

        try{
            const { input } = req.query;

            const places=await AutoCompleteServices.getListOfPlaces(input)

            res.status(200).json(places)

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

module.exports=AutoCompleteControllers;