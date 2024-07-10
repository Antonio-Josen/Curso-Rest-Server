const { response } = require("express")


const  validarArchivosSubir = (req,res=response,next) =>{

    if (!req.files || Object.keys(req.files).length === 0) {
        res.status(400).json({ msg: 'No files were uploaded - Archivo.' });
        return;
    }

    if (!req.files.archivo) {
        res.status(400).json({ msg: 'No files were uploaded -Archivo.' });
        return;
    }

    next();
}

module.exports={
    validarArchivosSubir

}