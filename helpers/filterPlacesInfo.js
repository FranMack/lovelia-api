
function filterPlacesInfo(array){

    const coordinates=array[0].geometry.location


    const country=array[0]["address_components"].filter((data)=>{
        if(data.types.includes("country")){
            return data
        }
    })[0]?.long_name

    const city=array[0]["address_components"].filter((data)=>{
        if(data.types.includes("administrative_area_level_2")){
            return data
        }
    })[0]?.long_name

    const state=array[0]["address_components"].filter((data)=>{
        if(data.types.includes("administrative_area_level_1")){
            return data
        }
    })[0]?.long_name



    return {city,state,country,coordinates}

}






module.exports={filterPlacesInfo}




