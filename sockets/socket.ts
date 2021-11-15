import { Socket } from "socket.io";
import socketIO from 'socket.io';
import { UserList } from "../classes/user-list";
import { User } from "../classes/user";

export const connectedUsers = new UserList();

export const conectarCliente = (cliente: Socket) => {
    const user = new User(cliente.id);
    connectedUsers.add(user);
};

export const desconectar = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('disconnect', () => {
        const deletedUser = connectedUsers.delete(cliente.id);
        console.log('Cliente desconectado', deletedUser?.name);
        io.emit('usuarios-activos', connectedUsers.list());
    });
};

//Escuchar mensajes
export const mensaje = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('mensaje', (payload: { de: string, cuerpo: string }) => {
        console.log('Mensaje recibido:', payload);

        io.emit('mensaje-nuevo', payload);
    });
};

// Configurar usuario
export const configUsuario = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('config-usuario', (payload: { name: string }, callback: Function) => {
        console.log('Configurando usuario:', payload.name);

        connectedUsers.update(cliente.id, payload.name);

        io.emit('usuarios-activos', connectedUsers.list());

        callback({
            ok: true,
            message: `Usuario ${ payload.name }, configurado!`
        });
    });
};

// Obtener usuarios
export const usuarios = (cliente: Socket, io: socketIO.Server) => {
    cliente.on('obtener-usuarios', () => {
        io.to(cliente.id).emit('usuarios-activos', connectedUsers.list());
    });
}