const {
  User,
  Sold_Product,
  Delivery,
  Billing,
  TalismanDigital
} = require("../models/index.models");

class SoldProductServices {
  static addProduct = async (productList, delivery_id, billing_id) => {
    try {
      // Verificar que el array de productos no esté vacío
      if (productList.length === 0) {
        throw new Error("No products provided");
      }

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
          delivery_id: delivery_id ? delivery_id:null,
          billing_id: billing_id ? billing_id : null,
        };

        return productData;
      });

      // Crear las promesas para cada producto

      const promises = products.map((item) => {
        return Sold_Product.create(item);
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

      const billings_id = billing.map((item) => {
        return item._id;
      });

      console.log("yyyyyyyyyyyyyy",billings_id)

      const promises0 = billings_id.map((id) => Billing.findById(id));
      const billingInfo = await Promise.all(promises0);
      const billingResumeInfo = billingInfo.map((item) => {
        return {
          payment_method: item.payment_method,
          date: item.date,
          id: item._id,
        };
      });
      const promises1 = billings_id.map((id) =>
        Sold_Product.find({ billing_id: id })
      );

      const products = await Promise.all(promises1);

  

      // Crear las promesas para cada producto
      console.log("xxxxxxxxx",products)
      const deliveryId = products.map((item) => item[0].delivery_id);

      const promises = deliveryId.map((id) => Delivery.findById(id));

      // Ejecutar todas las promesas en paralelo
      const deliveryInfo = await Promise.all(promises);

      // Combinar la información
      const combinedArray = products.map((product) => {
        const delivery = deliveryInfo.find(
          (del) =>
            del && del._id.toString() === product[0].delivery_id.toString()
        );
        const billing = billingResumeInfo.find(
          (bill) =>
            bill && bill.id.toString() === product[0].billing_id.toString()
        );
        return {
          products: product, // convertir a objeto plano si es necesario
          deliveryDetails: delivery ? delivery.toObject() : null,
          billingDetails: billing ? billing : null,
        };
      });

      const hasTalismanDigital= await TalismanDigital.findOne({ email })

      const talismanDigitalStatus= !hasTalismanDigital ? {subscription:false,activated:false}:{subscription:true,activated:hasTalismanDigital.activated}



      return {combinedArray,talismanDigitalStatus}; // Agrupar el array combinado
    } catch (error) {
      throw error;
    }
  };
}

module.exports = SoldProductServices;
