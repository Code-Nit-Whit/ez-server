const { dialog, shell } = require('electron');
const EventEmitter = require('events');
const path = require('path');
const express = require('express');
const WebSocket = require('wss');


const { TrayIcon } = require('./TrayIcon.js');
const { FileWatcher } = require('./FileWatcher.js');
const { logMessage } = require('./logger.js');
const { sendNotification } = require('./notifications.js');

class Server {
    constructor() {
        this.name =
        this.contentTypeMapping = {
            '.html': 'text/html',
            '.htm': 'text/html',
            '.mjs': 'text/javascript',
            '.cjs': 'text/javascript',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.xml': 'application/xml',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        };

        this.entryFilePath = null;
        this.entryDirectory = null;
        this.homePageFilePath = path.join(__dirname, '../assets/home.html');
        this.ipAddress = '127.0.0.1';
        this.port = 3000;
        this.url = `http://${this.ipAddress}:${this.port}`;

        //Express server 
        this.server = express();
        this.routes = [
            this.server.get('*', (req, res, next) => {
                const resolvedPath = path.resolve(server.entryDirectory, req.path);

                if (server.customCache.size > 0 && server.customCache.has(resolvedPath)) {
                    res.sendFile(server.customCache.get(resolvedPath));
                } else {
                    express.static(server.entryDirectory)(req, res, next);
                }
            }),

            this.server.use(express.static(path.join(__dirname, this.homePageFilePath))),

            //404 file not found html file
            this.server.use((req, res, next) => {
                res.status(404).sendFile(path.join(__dirname, '../assets/errors/404.html'));
            }),

            //500 internal server error html file
            this.server.use((err, req, res, next) => {
                logMessage('error', 'Server error: ', { errorObject: err });
                res.status(500).sendFile(path.join(__dirname, '../assets/errors/500.html'));
            })
        ];

        this.emitter = new EventEmitter();
        this.emitter.on('file', () => {
            this.selectFile();
        }).on('start', () => {
            this.startServer();
        }).on('stop', () => {
            this.stopServer();
        }).on('reload', () => {
            this.reloadServer();
        });

        this.tray = new TrayIcon();
        this.setListeners();

        this.fileWatcher = new FileWatcher();
        this.wss = new WebSocket.Server({ server: this.server });
    }

    setupWebSocket() {
        this.wss.on('connection', (ws) => {
            logMessage('info', 'Websocket client connected');

            ws.on('message', (message) => {
                logMessage('info', `Received websocket message: ${message}`);
                if(message === 'select-file') { 
                    this.selectFile();
                } else if (message === 'start-server') {
                    this.startServer();
                }
                //consider adding more home page otions like opening docs site in browser, as well as maybe doing the samewith github issues, contributing info, donations links, etc
            });

            ws.on('close', () => {
                logMessage('info', 'CWebsocket cient disconnected');
            });

            this.triggerReload = () => {
                ws.send('reload');
            };
        });
    };

    selectFile() {
        try {
            const result = dialog.showOpenDialogSync({
                title: 'Select Entry File',
                properties: ['openFile'],
                filters: [{ name: 'HTML & JS Files', extentions: ['html', 'htm', '.js'] }]
            });
            logMessage('debug', `Dialog result: ${result}`);
            if (!result.cancelled) {
                this.entryFilePath = result[0];
                this.entryDirectory = path.dirname(this.entryFilePath);
                logMessage('debug', `Global Path: ${this.entryFilePath}, Global Directory Path: ${this.entryDirectory}`);
            }
        } catch (error) {
            logMessage('error', `Failed to load file`, { errorObject: error });
            sendNotification('EZ-Server', 'Failed to load file');
        }
    };

    openInBrowser() {
        try {
            shell.openExternal();
            logMessage('info', `Opening ${this.url} in default browser.`);
        } catch (error) {
            logMessage('error', `Failed to open ${this.url} in default browser`, { errorObject: error });
            sendNotification('EZ-Server', `Failed to open ${this.url} in default browser.`);
        }
    };

    setListeners() {
        try {
            this.emitter.on('start', () => {
                logMessage('debug', `Recieved start server event`);
                this.startServer();
            });
            this.emitter.on('stop', () => {
                logMessage('info', `Recieved stop server event`);
                this.stopServer();
            });
        } catch (error) {
            logMessage('error', `Recieved error while setting up hot reloading`, { errorObject: error });
            sendNotification('EZ-Server', 'Recieved error while setting up hot reloading');
        }
    };

    getContentType(filePath) {
        const extname = path.extname(filePath);
        let mimeType;
        if (!(mimeType = this.contentTypeMapping[extname])) mimeType = 'text/plain';
        logMessage('debug', `Mime type: ${mimeType}`);
        return mimeType;
    };

    respondToGet(req, res) {
        this.server.use(express.static(globalDirectoryPath));
    };

    startServer() {
        try {
            if (!this.entryFilePath) {
                this.selectFile();
            }

            logMessage('debug', `Starting server from ${this.entryFilePath}. Value of server: ${this.server}`);

            this.server.listen(this.port, () => {
                this.hotReloader.init(this, this.sseApp);
                logMessage('info', `Server is listening on ${this.url} serving from ${this.entryFilePath}`);
                sendNotification('EZ-Server', `Server started on ${this.url} serving from ${this.entryFilePath}`);
            });

            this.server.use((err, req, res, next) => {
                logMessage('error', `Server error: `, { errorObject: err });
                res.status(500).sendFile(path.join(__dirname, '../assets/errors/500.html'));
            });

            if (this.server) {
                this.tray.updateTrayIcon('running');
                this.window.openWindow();
            } else {
                logMessage('warn', `Server is already running`);
                sendNotification('EZ-Server', 'Server is already running');
            }
        } catch (error) {
            logMessage('error', `Error starting server: ${error.message}`, { errorObject: error });
            sendNotification('EZ-Server', `Error in start server: ${error.message}`);
        }
    }

    stopServer() {
        try {
            if (this.server) {
                this.server.close(() => {
                    logMessage('info', `Server stopped on ${this.ipAddress}:${this.port}`);
                });
            }
        } catch (error) {
            logMessage('error', `Failed to stop server`, { errorObject: error });
            sendNotification('EZ-Server', `Failed to stop server`);
        }
    }
}


module.exports = { Server };