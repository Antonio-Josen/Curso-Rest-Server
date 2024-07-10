const { response } = require("express");
const  path = require("path");
const { subirArchivo } = require("../helpers");
const { Usuario,Producto} = require("../models");
const  fs  = require("fs");


const cargarArchivo =  async(req, res = response) => {
    try {
        //Imagenes
        const nombre = await subirArchivo(req.files,['txt','md'],'Textos');
        res.json({
            nombre:nombre
        })
    } catch(msg){
        res.status(400).json({msg})
    }

}


const actualizarImagen = async(req,res = response) =>{



    const {id,coleccion} = req.params;
 
  
    
    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No Existe Un Usuarios con el id ${id}`
                });
            }
            
            break;

            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No Existe Un Producto con el id ${id}`
                    });
                }
                
                break;
        
    
        default:
            return res.status(500).json({msg:'Se me olvido validar Esto'});
    }

        //Limpiar Imágenes previas

        if(modelo.img){
            //Hay que borrar la imagen del Servidor
            const pathImagen =path.join( __dirname,'../uploads',coleccion,modelo.img);
            if(fs.existsSync(pathImagen)){
                fs.unlinkSync(pathImagen);
            }

        }


    const nombre = await subirArchivo(req.files,undefined,coleccion);
    modelo.img =nombre;

    await modelo.save();

    res.json(modelo);

}


const mostrarImagen =  async(req,res = response) =>{

    const {id,coleccion} = req.params
   
    let modelo;
    
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No Existe Un Usuarios con el id ${id}`
                });
            }
            
            break;

            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return res.status(400).json({
                        msg: `No Existe Un Producto con el id ${id}`
                    });
                }
                
                break;
        
    
        default:
            return res.status(500).json({msg:'Se me olvido validar Esto'});
    }

        //Limpiar Imágenes previas

        if(modelo.img){
            //Hay que borrar la imagen del Servidor
            const pathImagen =path.join( __dirname,'../uploads',coleccion,modelo.img);
            if(fs.existsSync(pathImagen)){
              return res.sendFile(pathImagen)
            }
        }


        const pathImagen = path.join(__dirname,'../assets/no-image.jpg');
        res.sendFile(pathImagen);
}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen
}