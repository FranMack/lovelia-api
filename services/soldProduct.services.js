const {
  User,
  Sold_Product,
  Delivery,
  Billing,
  TalismanDigital,
  Product,
} = require("../models/index.models");

class SoldProductServices {
  static addProduct = async (productsFinalInfo, delivery_id, billing_id) => {
    try {
      // Verificar que el array de productos no esté vacío

      if (productsFinalInfo.length === 0) {
        throw new Error("No products provided");
      }

      const products = productsFinalInfo.map((item) => {
        // Extraer los valores del documento y convertir a objeto plano
        const productData = {
          model: item.model,
          metal: item.metal,
          rock: item.rock,
          chain: item.chain,
          intention: item.intention,
          price: item.price,
          currency:item.currency,
          quantity: item.quantity,
          delivery_id: delivery_id ? delivery_id : null,
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
      const deliveryId = products.map((item) => item[0]?.delivery_id);
      console.log("deliveryIdxxxxxxxxxxxxxxx",deliveryId)
      const promises = deliveryId.map((id) => Delivery.findById(id));

      // Ejecutar todas las promesas en paralelo
      const deliveryInfo = await Promise.all(promises);

      // Combinar la información
      const combinedArray = products.map((product) => {
        const delivery = deliveryInfo.find(
          (del) =>
            del && del._id?.toString() === product[0]?.delivery_id?.toString()
        );

        const billing = billingResumeInfo.find(
          (bill) =>
            bill && bill.id?.toString() === product[0]?.billing_id?.toString()
        );

        return {
          products: product, // convertir a objeto plano si es necesario
          deliveryDetails: delivery
            ? typeof delivery.toObject === "function"
              ? delivery.toObject()
              : delivery
            : null,
          billingDetails: billing || null,
        };
      });

      const hasTalismanDigital = await TalismanDigital.findOne({ email });

      const talismanDigitalStatus = !hasTalismanDigital
        ? { subscription: false, activated: false }
        : { subscription: true, activated: hasTalismanDigital.activated };

      return { combinedArray, talismanDigitalStatus }; // Agrupar el array combinado
    } catch (error) {
      throw error;
    }
  };

  //admin controllers

  static async getListOfOrders() {

    try {
    
      const listOfOrders = await Sold_Product.aggregate([
        {
          // Combinar los productos vendidos que tengan el mismo billing_id
          $group: {
            _id: "$billing_id", // Agrupa por billing_id
            products: { $push: "$$ROOT" }, // Incluye todos los documentos originales en un array llamado "products"
          },
        },
        {
          // Hace un "lookup" para popular los datos del billing
          $lookup: {
            from: "billings", // Nombre de la colección de Billing
            localField: "_id", // Campo en esta colección (billing_id)
            foreignField: "_id", // Campo en la colección "billings"
            as: "billingInfo", // Alias para los datos relacionados
          },
        },
        {
          // Hace un "lookup" para popular los datos del delivery
          $lookup: {
            from: "deliveries", // Nombre de la colección de Delivery
            localField: "products.delivery_id", // Campo en los productos agrupados
            foreignField: "_id", // Campo en la colección "deliveries"
            as: "deliveryInfo", // Alias para los datos relacionados
          },
        },
      ]);

      if(!listOfOrders){
        throw new Error("Ordenes no encontradas")
      }
      return listOfOrders
    } catch (error) {
      throw error;
    }
  }
}

module.exports = SoldProductServices;
