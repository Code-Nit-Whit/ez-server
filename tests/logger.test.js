// logger.test.js
const { logMessage } = require('../src/logger.js');
const winston = require('winston');

// Mock the winston module
jest.mock('winston', () => {
  const mFormat = {
    combine: jest.fn(),
    simple: jest.fn(),
    timestamp: jest.fn(),
    prettyPrint: jest.fn()
  };
  return {
    format: mFormat,
    transports: {
      File: jest.fn(),
      Console: jest.fn()
    },
    createLogger: jest.fn().mockReturnValue({
      log: jest.fn()
    })
  };
});

jest.mock('electron', () => ({
  app: {
    isPackaged: false, 
  }
}));


describe('Logger Formatting', () => {
  
  it('should create a logger with the correct format', () => {
    expect(winston.createLogger).toHaveBeenCalledWith(expect.objectContaining({
      transports: expect.any(Array),
      rejectionHandlers: expect.any(Array),
      exceptionHandlers: expect.any(Array)
    }));
  });

  it('should log messages with the correct level and message', () => {
    const mockLog = winston.createLogger().log; // Get the mocked log function
    logMessage('info', 'Test info message');
    expect(mockLog).toHaveBeenCalledWith({
      level: 'info',
      message: 'Test info message'
    });
  
    logMessage('error', 'Test error message');
    expect(mockLog).toHaveBeenCalledWith({
      level: 'error',
      message: 'Test error message'
    });
  });
  
  it('should log the error object when provided', () => {
    const mockLog = winston.createLogger().log;
    const testError = new Error('Test error');
    logMessage('error', 'Logging an error object', { errorObject: testError });
    expect(mockLog).toHaveBeenCalledWith(expect.objectContaining({
      level: 'error',
      message: 'Logging an error object',
      meta: {
        errorObj: testError
      }
    }));
  });
  
  it('should log messages correctly without an error object', () => {
    const mockLog = winston.createLogger().log;
    logMessage('warn', 'Warning message without error object');
    expect(mockLog).toHaveBeenCalledWith({
      level: 'warn',
      message: 'Warning message without error object'
    });
  });
});

