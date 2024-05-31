const { Notification } = require('electron');
const { logMessage } = require('./logger.js');

process.on('uncaughtException', async (error) => {
    logMessage('error', `UncaughtException: ${error.message}`);
});

/**
 * Sends a notification.
 * @param {string} title The title of the notification.
 * @param {string} body The body of the notification.
 * @param {object} [options={}] Optional notification options.
 */
async function sendNotification(title, body) {
    try {
        new Notification({
            title: title,
            body: body
        }).show();
    } catch (error) {
        logMessage('error', 'Failed to send notification', {errorObject: error});
    }
}

module.exports = { sendNotification };