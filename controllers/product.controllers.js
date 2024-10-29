const ProductServices= require("../services/product.services")

class ProductControllers{

    static  addProduct=async(req,res)=>{
        

        try{

            const products= await ProductServices.addProduct(req.body)

            res.status(200).json("Products added")

        }

        catch(error){
            console.log(error)
        }


    }

    static productList=async(req,res)=>{
        try{
            const {email}=req.params

            const products= await ProductServices.productList(email)
            
            res.status(200).json(products)

        }

        catch(error){
            console.log(error)
        }


    }
}


module.exports=ProductControllers