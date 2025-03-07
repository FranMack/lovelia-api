const { envs } = require("./config/env.config")

 const googleCloudCredentials  ={
    
    type : envs.GOOGLE_CLOUD_TYPE,
    project_id : envs.GOOGLE_CLOUD_PROJECT_ID,
    private_key_id : envs.GOOGLE_CLOUD_PRIVATE_KEY_ID,
    private_key :envs.GOOGLE_CLOUD_PRIVATE_KEY,
    client_email : envs.GOOGLE_CLOUD_CLIENT_EMAIL,
    client_id : envs.GOOGLE_CLOUD_CLIENT_ID,
    auth_uri : envs.GOOGLE_CLOUD_AUTH_URI,
    token_uri : envs.GOOGLE_CLOUD_TOKEN_URI,
    auth_provider_x509_cert_url : envs.GOOGLE_CLOUD_UNIVERSE_DOMAIN,
    client_x509_cert_url : envs.GOOGLE_CLOUD_CLIENT_X509_CERT_URL,
    universe_domain : envs.GOOGLE_CLOUD_UNIVERSE_DOMAIN,
}

module.exports={googleCloudCredentials }

