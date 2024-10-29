const axios = require("axios");

class DhlControllers{

    static async getRate(req,res){

        const DHL_BASE_URL = 'https://express.api.dhl.com/mydhlapi/rates';
        const DHL_API_KEY = 'U73J6L1N6mCsd4sLwHjZ8UGd3qoAefdK';

        const { origin, destination, weight, dimensions } = req.body;

        try {
          const response = await axios.post(DHL_BASE_URL, {
            originAddress: {
              postalCode: origin.postalCode,
              countryCode: origin.countryCode
            },
            destinationAddress: {
              postalCode: destination.postalCode,
              countryCode: destination.countryCode
            },
            packages: [{
              weight: weight,
              dimensions: {
                length: dimensions.length,
                width: dimensions.width,
                height: dimensions.height
              }
            }]
          }, {
            headers: {
              'DHL-API-Key': DHL_API_KEY,
              'Content-Type': 'application/json'
            }
          })}

        catch (error) {
            if (error.response) {
              res.status(error.response.status).json({ error: error.message });
            } else {
              res.status(400).json({ error: error.message });
            }
          }
    }
}

module.exports={DhlControllers}