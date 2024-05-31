/**
 * File: logger.js
 * Description: centralized logging module utilizing a single Winston logger instance and a custom trasport to a custom console in the config window.
 * URL: https://www.github.com/Code-Nit-Whit/ez-server/src/main/logger.js
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

const { app } = require('electron');
const winston = require('winston');

try {
    const format = winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp(),
        winston.format.prettyPrint()
    );
    
    const transports = [
        new winston.transports.File({ filename: 'error.log', level: 'error', format: format }),
        new winston.transports.File({ filename: 'combined.log', format: format }),
    ]
    
    if (!app.isPackaged || app.isDevMode) {
        transports.push(new winston.transports.Console({
            level: 'debug',
            format: format
        }));
    }
    
    const logger = winston.createLogger({
        level: "info",
        transports: transports,
        rejectionHandlers: transports,
        exceptionHandlers: transports
    });
    
    function logMessage(level, message, opts = { errorObject: null }) {
        const logEntry = {
            level: level,
            message: message
        };
    
        if (opts.errorObject instanceof Error) {
            logEntry.meta = {};
            logEntry.meta.errorObj = opts.errorObject;
        }
    
        logger.log(logEntry);
    }
} catch (error) {
    console.error(error);
}

module.exports = { logMessage };