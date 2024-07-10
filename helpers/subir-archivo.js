const { v4: uuidv4 } = require('uuid');

const path = require('path');


const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        

        const { archivo } = files;

        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];
        console.log(nombreCortado);



        //Validar la extension

        if (!extensionesValidas.includes(extension)) {
            return reject(`La Extension ${extension} no es permitida - ${extensionesValidas}`);
        }

        const nombreTemporal = uuidv4() + '.' + extension;


        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        archivo.mv(uploadPath, function (err) {
            if (err) {
                console.log(err)
                reject(err);
            }

            resolve(nombreTemporal);    
        });

    });



}


module.exports = {
    subirArchivo
}