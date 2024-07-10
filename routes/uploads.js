const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos,validarArchivosSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();


router.post('/',validarArchivosSubir,cargarArchivo);

router.put('/:coleccion/:id',[
    validarArchivosSubir,
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c =>coleccionesPermitidas( c, ['usuarios','productos']) ),
    validarCampos
],actualizarImagen)


router.get('/:coleccion/:id',[ 
    check('id','El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom( c =>coleccionesPermitidas( c, ['usuarios','productos']) ),
    validarCampos
],mostrarImagen)
module.exports = router;