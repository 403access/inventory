# File-Based Logging System

This project now includes a comprehensive file-based logging system that replaces console.log statements throughout the backend.

## Features

- **Automatic log file creation**: Logs are stored in `./logs/server.log`
- **Timestamped entries**: Each log entry includes an ISO timestamp
- **JSON data logging**: Support for logging complex objects and data structures
- **Global logger**: Easy-to-use logging functions available throughout the application

## Usage

### Basic Logging

```typescript
import { log, logJSON } from "../utils/app-logger";

// Simple text logging
await log("Server started successfully");

// Logging with additional data
await log("Processing request", requestId, userId);

// Logging JSON data
await logJSON("Database query result", queryResult);
```

### Using the Logger Instance

```typescript
import { getLogger } from "../utils/app-logger";

const logger = getLogger();
await logger.log("Custom message");
await logger.logJSON("Data object", dataObject);
```

## Setup

The logging system is automatically initialized during server setup:

1. A `logs` directory is created in the project root
2. A file logger is initialized pointing to `./logs/server.log`
3. The logger instance is added to the application config
4. All subsequent logging uses the file-based system

## Log File Location

- **Development**: `./logs/server.log`
- **Production**: Same location (ensure proper file permissions)

## Log Format

Each log entry follows this format:
```
[2025-08-06T22:41:00.158Z] Message content
[2025-08-06T22:41:00.159Z] Message with data: {"key": "value"}
```

## Migration from console.log

Replace console.log statements with the logging functions:

```typescript
// Before
console.log("User logged in:", userId);

// After
await log("User logged in:", userId);
```

## Benefits

1. **Persistent logs**: All log entries are saved to disk
2. **Better debugging**: Timestamps help with debugging timing issues
3. **Production ready**: Logs are properly structured and can be easily parsed
4. **Non-blocking**: File operations are asynchronous and don't block the main thread
5. **Centralized**: All logging goes through a single system for consistency

## Log Management

- Logs are appended to the file, so they grow over time
- Consider implementing log rotation for production environments
- The log file can be safely deleted - it will be recreated on next startup

## Environment Configuration

The logging system uses the folder structure defined in `src/utils/folders.ts`. The logs directory is automatically created if it doesn't exist.
