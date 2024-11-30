  // src/errors/errorLogger.js
  export const errorLogger = {
    logError: (error) => {
      console.error(`[${new Date().toISOString()}] ERROR:`, {
        message: error.message,
        stack: error.stack,
        statusCode: error.statusCode
      });
    },
    
    logWarning: (message) => {
      console.warn(`[${new Date().toISOString()}] WARNING:`, message);
    },
    
    logInfo: (message) => {
      console.info(`[${new Date().toISOString()}] INFO:`, message);
    }
  };
  