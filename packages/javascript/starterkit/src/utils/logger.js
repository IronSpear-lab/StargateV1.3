/**
 * Logs an informational message with optional data.
 * @param {string} message - The informational message to log.
 * @param {any} [data] - Optional data to accompany the message.
 */
export const logInfo = (message, data) => {
  if (data !== undefined) {
    console.log(`[INFO]: ${message}`, data);
  } else {
    console.log(`[INFO]: ${message}`);
  }
};

/**
 * Logs an error message with an optional error object.
 * @param {string} message - The error message to log.
 * @param {any} [error] - Optional error object or additional error data.
 */
export const logError = (message, error) => {
  if (error !== undefined) {
    console.error(`[ERROR]: ${message}`, error);
  } else {
    console.error(`[ERROR]: ${message}`);
  }
};

// You can also create a default logger object if preferred
const logger = {
  info: logInfo,
  error: logError,
};

export default logger;
