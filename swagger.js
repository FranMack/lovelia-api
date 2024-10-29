const swaggerJSDoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")
const {envs}=require("./config/env.config")


//Metadata unfo about our API
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lovelia API',
      description: `
Lovelia es una API diseñada para proporcionar información astrológica personalizada a los usuarios. Su principal función es ofrecer los datos necesarios para construir el mapa astral del usuario y crear el talismán correspondiente.

## Funcionalidades Principales:

- **Registro de Usuarios:** Los usuarios deben registrarse en la plataforma para acceder a los servicios de Lovelia. Durante el registro, se solicitarán los datos necesarios para generar el perfil astrológico del usuario.

- **Suscripción Única:** Para acceder a la información astrológica y utilizar las funcionalidades de la API, los usuarios deben realizar un único pago de suscripción. Una vez completado el pago, tendrán acceso completo a todas las características de Lovelia.

- **Generación de Carta Natal:** Lovelia proporciona los datos necesarios para construir la carta natal del usuario. Esto incluye información sobre los signos astrológicos, los elementos y otros aspectos relevantes basados en la fecha, hora y lugar de nacimiento del usuario.

- **Creación de Talismán:** Además de la carta natal, la API permite crear un talismán personalizado para el usuario. Este talismán está diseñado según los principios astrológicos y puede servir como una herramienta espiritual o de protección.
`,
      version: '1.0.0',
    },
    servers: [
      {
          url: 'http://localhost:3000/api/v1/',
      },
      {
        url:`${envs.DOMAIN_URL}`,
    }
      // Puedes agregar más servidores si es necesario
  ],
  },
  apis: ['./routes/user.routes.js','./routes/paypal.routes.js','./routes/mercadopago.routes.js'], // files containing annotations as above
};

  //Docs en Json format

  const swaggerSpec=swaggerJSDoc(options)

  //Function to setup our docs
  const swaggerDocs=(app,port)=>{
    app.use("/api/v1/docs",swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  }


  module.exports={swaggerDocs}