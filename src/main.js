const { app } = require('electron');
const { sendNotification } = require('./notifications.js');
const { logMessage } = require('./logger.js');
const {Server} = require('./Server.js');
const express = require('express');
const {EventEmitter} = require('events')

const emitter = new EventEmitter();

const servers = {};
servers.defaultServer = null;

process.on('uncaughtException', async (error) => {
    logMessage('error', `UncaughtException: ${error.message}`);
});

//Custom menu


app.whenReady().then(result => {
    try {
        //Create internal websocket server (ipc alt) and control panel/config window
        startInternalServer();
        servers.defaultServer = new Server();
            mainWindow = new Window(this.url, this.openInBrowser);

        emitter.on('window', () => {
            openWindow();
        }).on('new', () => {
            createServer();
        });
    } catch (error) {
        logMessage('error', `Failed to create tray icon`, { errorObject: error });
    }
});

app.on('will-quit', () => {
    if (servers.defaultServer) {
        const message = 'Application quit recieved, server closing';
        logMessage('info', message);
        sendNotification('Ez-Server', message);
    }
});

//JWT? http based ipc, basically. isolate it and lock it down...
function startInternalServer() {
    servers.internalServer = express();

    servers.internalServer.use((req, res, next) => {
        const token = req.header('Authorization');
        if (!token) return res.status(401).send('Access Denied');
        
        try {
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.user = verified;
            next();
        } catch (err) {
            res.status(400).send('Invalid Token');
        }
    }); 
}