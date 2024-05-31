/**
 * File: TrayIcon.js
 * Class: TrayIcon, Contains: Tray instance
 * Description: A custom class in charge of creating a tray icon for a server instance creating and manageing this class instancce. Recreates icon as needed to change icon colors. Creates the context menu and managed event emissions upon user selection. One per server instance. 
 * URL: https://www.github.com/Code-Nit-Whit/ez-server/src/main/TrayIcon.js
 * Dep Libraries: 
 * Version: 1.0.0
 * Since: 1.0.0
 * Author: Code-Nit-Whit
 * Funding: https://www.buymeacoffee.com/code-nit-whit
 * App: EZ-Server
 * Homepage: https://www.ez-server.dev
 * Repo: https://www.github.com/Code-Nit-Whit/ez-server
 * Bugs: https://www.github.com/Code-Nit-Whit/ez-server/issues || https://www.bugreportwebsite.com/Ez-Server/v1.0.0
 * License: MIT , https://github.com/Code-Nit-Whit/ez-server/LICENSE.txt
 * Modified Date: 
 * Constributors: {}
 * ChangeLog: 
 */

const { app, Tray, Menu } = require('electron');
const path = require('path');
const EventEmitter = require('events');
const { logMessage } = require('./logger.js');
const { start } = require('repl');

process.on('uncaughtException', async (error) => {
    logMessage('error', `UncaughtException: ${error.message}`);
});

class TrayIcon {
    constructor() {
        this.iconPaths = {
            icon: path.join(__dirname, "../assets/icons/icon.png"),
            running: path.join(__dirname, "../assets/icons/running.png"),
            error: path.join(__dirname, "../assets/icons/error.png")
        };


        this.eventEmitter = new EventEmitter();

        this.startState = false;
        this.stopState = false;
        this.contextMenu = Menu.buildFromTemplate([
            { label: 'Start Server', enabled: this.startState, click: () => { this.eventEmitter.emit('start') } },
            { label: 'Relaod Server', enabled: this.stopState, click: () => { this.eventEmitter.emit('reload') } },
            { label: 'Close Server', enabled: this.stopState, click: () => { this.eventEmitter.emit('stop') } },
            { type: 'separator' },
            { label: 'Select File', enabled: true, click: () => { this.eventEmitter.emit('file') } },
            { label: 'Control Panel', enabled: this.startState, click: () => { this.eventEmitter.emit('window') } },
            { type: 'separator' },
            { label: 'New Server', enabled: false, click: () => { this.eventEmitter.emit('start') } },
            { label: 'Quit App', enabled: true, click: app.quit }
        ]);

        this.tray = new Tray(this.iconPaths.icon);
        this.tray.setToolTip('EZ-Server');
        this.tray.setContextMenu(this.contextMenu);
    }

    updateTrayIcon(iconType) {
        try {
            this.tray.destroy();
            this.tray = null;

            const icon = this.iconPaths[iconType];
            setTimeout(() => {
                this.tray = new Tray(icon);
                this.tray.setToolTip('EZ-Server');
                this.tray.setContextMenu(this.contextMenu);
            }, 500);

            logMessage('debug', `Server's tray icon has been changed to ${iconType}.`);
        } catch (error) {
            logMessage('error', `Failed to update tray icon`, { errorObject: error });
        }
    }
}

module.exports = { TrayIcon };