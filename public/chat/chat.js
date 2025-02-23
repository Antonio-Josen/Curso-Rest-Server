

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');




let usuario = null;
let socket = null;

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


//Validar el Token del Local Storage
const validarJWT = async () => {



    const token = localStorage.getItem('token' || '');

    if (token === null || token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No Hay Token en el servidor');
    }


    const resp = await fetch(url, {
        headers: { 'x-token': token }
    });

    const { usuario: UserDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);

    usuario = UserDB;

    console.log(usuario);
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline')
    });

    socket.on('recibir-mensajes', dibujarMensajes);

   
    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado:', payload)
    });
}

const dibujarUsuarios = (usuarios = []) => {

    let userHtml = '';
    usuarios.forEach(({ nombre, uid }) => {

        userHtml += `
        <li>
            <p>
                <h5 class="text-success">${nombre}</h5>
                <span class ="fs-6 text-muted">${uid}</span>
            </p>

        </li>
        `;
    });

    ulUsuarios.innerHTML = userHtml;

}


txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }


    socket.emit('enviar-mensaje', { uid, mensaje });


})



const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';
    mensajes.forEach(({ nombre, mensaje }) => {

        mensajesHtml += `
        <li>
            <p>
                <span class="text-primary">${nombre}:</span>
                <span>  ${mensaje} </span>
            </p>

        </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;

}


const main = async () => {

    // Validar JWT
    await validarJWT();

}


main();


