const chokidar = require('chokidar');
const { sendNotification } = require('./notifications');

class FileWatcher {
    constructor() {
        // File watching
        this.serverReference = null;
        this.watcher = null;
        this.watchPaths = [];
    }

    init(serverRef, sses) {
        this.serverReference = serverRef;
        this.sseClient = sses.getClient();
    }

    addPath(watchPath, pathType) {
        if (!this.watcher) {
            this.watcher = chokidar.watch(watchPath, {
                ignored: /(^|[\/\\])\../,
                persistent: true,
                recursive: true
            });
        } else {
            if (pathType === 'file') {
                this.watcher.add(watchPath); 
            } else if(pathType === 'directory') {
                this.watcher.addDir(watchPath);
            }
        }
        this.updateWatchedPaths(); 
    }

    removePath(path, pathType) {
        if (this.watcher) {
            if (pathType === 'file') {
                this.watcher.unwatch(path); 
            } else if (pathType === 'directory') {
                this.watcher.unwatchDir(path);
            } else {
                console.warn(`Invalid pathType provided to removePath: ${pathType}`);
            }
            this.updateWatchedPaths(); 
        }
    }
    

    updateWatchedPaths() {
        if (this.watcher) {
            this.watchPaths = this.watcher.getWatched(); 
        } else {
            this.watchPaths = [];
        }
    }

    sendReload(type, path) {

      }
      

    setupEventListeners() {
        if (this.watcher) {
            this.watcher.on('error', error => {
                logMessage('error', 'An error occured during hot reloading:', error);
            });
            this.watcher.on('change', (path, stats) => {
                const extension = path.split('.').pop().toLowerCase();
                    this.sendReload('full');
            });          
            this.watcher.on('add', path => {
                logMessage('info', `File ${path} added to watcher`);
                this.watchPaths = this.watcher.getWatched(); 
            });
            this.watcher.on('addDir', path => {
                logMessage('info', `Directory ${path} added to watcher`);
                this.watchPaths = this.watcher.getWatched(); 
            });
            this.watcher.on('unlink', path => {
                logMessage('info', `File ${path} removed from watcher`);
                this.watchPaths = this.watcher.getWatched(); 
            });
            this.watcher.on('unlinkDir', path => {
                logMessage('info', `Path ${path} removed from watcher`);
                this.watchPaths = this.watcher.getWatched(); 
            });
        }
    }
    
    closeWatcher() {
        if (this.watcher) {
            this.watcher.removeAllListeners(); 
            this.watcher.close();
        } else{
            logMessage('warn', `Watcher is already closed`);
            sendNotification(`Watcher is already closed`);
        }
    }

}

module.exports = { FileWatcher };




