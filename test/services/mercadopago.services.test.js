const mongoose = require("mongoose");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const axios = require("axios");
const{envs}=require("../../config/env.config.js")
const { User } = require("../../models/index.models.js");
const MercadopagoServices = require("../../services/mercadopago.services.js");

describe("Mercado Pago", () => {
  const userData = {
    name: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "password123",
  };
  beforeAll(async () => {
    await mongoose.connect(envs.MONGODB_URL_TESTING);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await User.deleteMany({});
  });

  describe("Create Order",()=>{
    test("should throw an error if the user doesn´t exists", async () => {
        await expect(
          MercadopagoServices.createOrder(userData.email)
        ).rejects.toThrow("Wrong Credentials");
      });
    
      test("should throw an error if the user acount is not confirmed", async () => {
        const user=await User.create(userData)
        await expect(
          MercadopagoServices.createOrder(user.email)
        ).rejects.toThrow("Your account is not confirmed");
      });
      test("should throw an error if the subscription is not paid", async () => {
        const user=await User.create(userData)
        const userConfirm= await User.findOneAndUpdate({email:user.email},{confirm:true,token:"",payment:true,payment_id:"fdsfsDFG4"},{new:true})
        await expect(
          MercadopagoServices.createOrder(user.email)
        ).rejects.toThrow("The subscription for this account has already been paid");
      });
  })

  describe("Capture Order",()=>{

    test("", async()=>{

        

    })
  })

 

});
