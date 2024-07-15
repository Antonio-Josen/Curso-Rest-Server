const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();


const socketController = async (socket = new Socket(), io) => {

    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);

    if (!usuario) {
        return socket.disconnect();
    }
    // Agregar al Usuario Conectado
    chatMensajes.conectarUsuarios(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);


    // Conectarlo a una sala Especial
    socket.join(usuario.id); //global, socket.id, usuario.id




    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });


    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
     
        if(uid){
            console.log('Esta Entrando');
            socket.to(uid).emit('mensaje-privado',{ de: usuario.nombre,mensaje});
        }
        chatMensajes.enviarmensajes(usuario.uid, usuario.nombre, mensaje);
        io.emit('recibir-mensajes', chatMensajes.ultimos10);
    });




}


module.exports = {

    socketController
}