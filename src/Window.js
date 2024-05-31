const { BrowserWindow, WebContentsView } = require('electron');
const fs = require('fs');
const { logMessage } = require('./logger');
const { sendNotification } = require('./notifications');

class Window {
    constructor(url, callback) {
        this.browserWindow = null;
        this.url = url;
    }

    createWindow(params) {
        const webContentsView = new WebContentsView();
        this.browserWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            resizable: true,
            title: 'EZ-Server',
            webPreferences: {
                devTools: true,
            }
        });
        webContentsView.webContents.loadURL(this.url);
        this.browserWindow.contentView = webContentsView;
        webContentsView.setBounds({ x: 0, y: 0, width: 800, height: 600 });
        webContentsView.webContents.openDevTools();
    }

    openWindow() {
        try {
            if(!this.browserWindow) {
                this.createWindow();
            }
            this.browserWindow.show();
        } catch (error) {
            logMessage('error', `Failed to open internal window to ${url}`, { errorObject: error });
            sendNotification('EZ-Server', `Failed to open internal window.`);
            this.openInBrowser();

        }
    }

    showWindow() {
        this.browserWindow.show();
    }

    hideWindow() {
        this.browserWindow.hide();
    }

    reloadWindow() {
        this.browserWindow.webContents.reload();
    }
}

module.exports = { Window };