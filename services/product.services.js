const { User, Product, Delivery, Billing } = require("../models/index.models");

class ProductServices {
  static addProduct = async (productList, deliveryDetails, billingDetails) => {
    try {
      // Verificar que el array de productos no esté vacío
      if (productList.length === 0) {
        throw new Error("No products provided");
      }

      const deliveryInfo = await Delivery.create(deliveryDetails);

      const billingInfo = billingDetails.payment_id
        ? await Billing.create(billingDetails)
        : null;

      const products = productList.map((item) => {
        // Extraer los valores del documento y convertir a objeto plano
        const productData = {
          model: item.model,
          material: item.material,
          rock: item.rock,
          chain: item.chain,
          intention: item.intention,
          price: item.price,
          quantity: item.quantity,
          delivery_id: deliveryInfo._id,
          billing_id: billingInfo ? billingInfo._id : null,
        };

        return productData;
      });

      // Crear las promesas para cada producto

      const promises = products.map((item) => {
        return Product.create(item);
      });

      // Ejecutar todas las promesas en paralelo
      const result = await Promise.all(promises);

      // Retornar el resultado o algún indicador de éxito
      return result;
    } catch (error) {
      throw error;
    }
  };

  static productList = async (email) => {
    try {
      // Verificar si el usuario existe
      const userExist = await User.findOne({ email });

      if (!userExist) {
        throw new Error("User not found");
      }

      const billing = await Billing.find({ email });

      if (!billing) {
        throw new Error("Billing not found");
      }

      const billings_id=billing.map((item)=>{return item._id});
      const promises0 = billings_id.map((id) => Billing.findById(id));
      const billingInfo = await Promise.all(promises0);
      const billingResumeInfo=billingInfo.map((item)=>{return {payment_method:item.payment_method,date:item.date,id:item._id}})
      const promises1 = billings_id.map((id) => Product.find({billing_id:id}));

      const products=await Promise.all(promises1);
      
      

    
      // Crear las promesas para cada producto
      const deliveryId = products.map((item) => item[0].delivery_id);
     
      const promises = deliveryId.map((id) => Delivery.findById(id));

      // Ejecutar todas las promesas en paralelo
      const deliveryInfo = await Promise.all(promises);

    

      // Combinar la información
      const combinedArray = products.map((product) => {
        const delivery = deliveryInfo.find(
          (del) => del && del._id.toString() === product[0].delivery_id.toString()
        );
        const billing = billingResumeInfo.find(
          (bill) => bill && bill.id.toString() === product[0].billing_id.toString()
        );
        return {
          products:product, // convertir a objeto plano si es necesario
          deliveryDetails: delivery ? delivery.toObject() : null,
          billingDetails: billing ? billing : null,
        };
      });

   


      return combinedArray; // Agrupar el array combinado
    } catch (error) {
      throw error;
    }
  };
}

module.exports = ProductServices;
