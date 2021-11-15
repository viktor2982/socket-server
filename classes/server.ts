import express from "express";
import socketIO from 'socket.io';
import http from 'http';

import { SERVER_PORT } from "../global/environment";

import * as socket from '../sockets/socket';

export default class Server {
    private static _instance: Server;

    public app: express.Application;
    public port: number;

    public io: socketIO.Server;
    private httpServer: http.Server;

    private constructor() {
        this.app = express();
        this.port = SERVER_PORT;

        this.httpServer = new http.Server(this.app);
        this.io = new socketIO.Server( this.httpServer, { cors: {
            origin: true
        } } );

        this.socketsListen();
    }

    // Patrón singleton
    public static get instance() {
        return this._instance || (this._instance = new this());
    }

    private socketsListen(): void {
        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            // Conectar cliente
            socket.conectarCliente(cliente);

            // Login (configurar usuario)
            socket.configUsuario(cliente);

            // Mensajes
            socket.mensaje(cliente, this.io);

            // desconectar
            socket.desconectar(cliente);
        });
    }

    start(callback: () => void): void {
        this.httpServer.listen(this.port, callback);
    }
}