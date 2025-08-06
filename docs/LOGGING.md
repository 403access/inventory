# File-Based Logging System

This project includes a comprehensive file-based logging system with **newest-first viewing capabilities** that replaces console.log statements throughout the backend.

## ✨ Key Features

- **Automatic log file creation**: Logs are stored in `./logs/server.log`
- **Timestamped entries**: Each log entry includes an ISO timestamp
- **JSON data logging**: Support for logging complex objects and data structures
- **Global logger**: Easy-to-use logging functions available throughout the application
- **Newest-first viewing**: Multiple tools to view recent logs first
- **Search functionality**: Filter logs by keywords
- **Session markers**: Clear visual separation between server restarts

## 🚀 Quick Start

### View Recent Logs (Newest First)
```bash
# Quick view of recent logs
bun run logs

# More detailed log viewer
bun run logs:view

# Search logs for specific terms
bun run logs:search "error"
bun run logs:search "notion"

# Follow logs in real-time (like tail -f)
bun run logs:follow

# Follow logs with filtering
bun run logs:follow-search "database"
```

### Using in Code
```typescript
import { log, logJSON } from "../log/app-logger";

// Simple text logging
await log("Server started successfully");

// Logging with additional data
await log("Processing request", requestId, userId);

// Logging JSON data
await logJSON("Database query result", queryResult);
```

## 📋 Available Commands

| Command                             | Description                                        |
| ----------------------------------- | -------------------------------------------------- |
| `bun run logs`                      | Quick view of 15 recent log entries (newest first) |
| `bun run logs:view`                 | Advanced log viewer with more options              |
| `bun run logs:search <term>`        | Search logs for specific keywords                  |
| `bun run logs:follow`               | **Follow server logs in real-time**                |
| `bun run logs:follow-search <term>` | **Follow logs with filtering**                     |
| `bun run view-logs.ts server`       | View server logs                                   |
| `bun run view-logs.ts demo`         | View demo logs                                     |
| `bun run view-logs.ts all`          | View both server and demo logs                     |

## 🎯 Viewing Logs Newest-First

### Option 1: Quick Logs (Recommended)
```bash
bun run logs
```
Shows the 15 most recent log entries with newest at the top.

### Option 2: Advanced Log Viewer
```bash
# View recent logs
bun run logs:view

# Search for specific terms
bun run logs:search "database"
bun run logs:search "error"
```

### Option 3: Terminal Commands
```bash
# macOS/Linux - newest first
tail -r logs/server.log | head -20

# Follow logs in real-time (traditional method)
tail -f logs/server.log

# Follow logs in real-time (with our tool)
bun run logs:follow
bun run logs:follow-search "error"
```

## 📁 Log File Structure

```
logs/
├── server.log     # Main application logs
└── demo.log       # Demo/testing logs
```

## 📝 Log Format

Each log entry follows this format:
```
[2025-08-06T23:16:42.249Z] Server is running at 192.168.178.106:3000
[2025-08-06T23:16:42.245Z] Server info config: {"hostname":"192.168.178.106","port":3000}
```

### Session Markers
New server sessions are marked with clear visual separators:
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

			NEW LOGGING SESSION STARTED

@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

## 🛠 Advanced Usage

### Using the Logger Instance
```typescript
import { getLogger } from "../log/app-logger";

const logger = getLogger();
await logger.log("Custom message");
await logger.logJSON("Data object", dataObject);
```

### Reading Logs Programmatically
```typescript
import { getRecentLogs } from "../log/app-logger";

// Get the 10 most recent log entries
const recentLogs = await getRecentLogs('./logs/server.log', 10);
recentLogs.forEach(log => console.log(log));
```

## 📊 Setup & Architecture

The logging system is automatically initialized during server setup:

1. A `logs` directory is created in the project root
2. A file logger is initialized pointing to `./logs/server.log`
3. The logger instance is added to the application config
4. All subsequent logging uses the file-based system

## 🔄 Migration from console.log

Replace console.log statements with the logging functions:

```typescript
// Before
console.log("User logged in:", userId);

// After
await log("User logged in:", userId);
```

## ✅ Why This Approach?

Instead of writing logs "newest-first" to the file (which would be slow and risky), we:

1. **Append logs efficiently** (industry standard)
2. **Provide viewing tools** that show newest first
3. **Maintain performance** and file safety
4. **Enable flexible viewing** - you can view logs in any order

### Benefits

1. **Persistent logs**: All log entries are saved to disk
2. **Better debugging**: Timestamps help with debugging timing issues
3. **Production ready**: Logs are properly structured and can be easily parsed
4. **Non-blocking**: File operations are asynchronous and don't block the main thread
5. **Centralized**: All logging goes through a single system for consistency
6. **Newest-first viewing**: Easy-to-use tools to see recent activity first
7. **Searchable**: Built-in search functionality across all logs

## 📈 Log Management

- Logs are appended to files, so they grow over time
- Consider implementing log rotation for production environments
- Log files can be safely deleted - they will be recreated on next startup
- Use the viewing tools to avoid opening large log files directly

## 🔧 Environment Configuration

The logging system uses the folder structure defined in `src/utils/folders.ts`. The logs directory is automatically created if it doesn't exist.

## 💡 Pro Tips

1. **Use `bun run logs`** for quick daily log checking
2. **Use search** to find specific errors or events: `bun run logs:search "error"`
3. **Follow real-time logs** during development: `tail -f logs/server.log`
4. **Set up log rotation** for production to manage file sizes
