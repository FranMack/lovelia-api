
function getDate(){

    // Crear un nuevo objeto Date para obtener la fecha actual
const currentDate = new Date();

// Obtener el año, mes y día actual
const year = currentDate.getFullYear();
// El mes es devuelto como un número entre 0 y 11, así que sumamos 1 para obtener el mes actual
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Añadir 1 y asegurarse de tener dos dígitos
const day = String(currentDate.getDate()).padStart(2, '0'); // Asegurarse de tener dos dígitos

// Formatear la fecha en el formato "YYYY-MM-DD"
const formattedDate = `${year}-${month}-${day}`;

return formattedDate
}

function timeConverter(num,meridiam){


    if(meridiam==="PM"){
    
    if(num<12){return num+12}
    return num
    
    }
    if(meridiam==="AM"){
    
    return num}
    
    }

module.exports={getDate,timeConverter}