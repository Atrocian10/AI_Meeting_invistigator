export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  agent: string;
  message: string;
  metadata?: Record<string, unknown>;
  duration?: number;
}

class AgentLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(
    level: LogLevel,
    agent: string,
    message: string,
    metadata?: Record<string, unknown>,
    duration?: number
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      agent,
      message,
      metadata,
      duration,
    };

    this.logs.push(entry);

    // Keep logs bounded
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    const logMessage = `[${entry.timestamp}] [${agent}] ${message}`;
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, metadata);
        break;
      case LogLevel.INFO:
        console.info(logMessage, metadata);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, metadata);
        break;
      case LogLevel.ERROR:
        console.error(logMessage, metadata);
        break;
    }
  }

  debug(
    agent: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    this.log(LogLevel.DEBUG, agent, message, metadata);
  }

  info(
    agent: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    this.log(LogLevel.INFO, agent, message, metadata);
  }

  warn(
    agent: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    this.log(LogLevel.WARN, agent, message, metadata);
  }

  error(
    agent: string,
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    this.log(LogLevel.ERROR, agent, message, metadata);
  }

  timing(
    agent: string,
    message: string,
    duration: number,
    metadata?: Record<string, unknown>
  ): void {
    this.log(LogLevel.INFO, agent, message, metadata, duration);
  }

  getLogs(filter?: {
    agent?: string;
    level?: LogLevel;
    limit?: number;
  }): LogEntry[] {
    let filtered = [...this.logs];

    if (filter?.agent) {
      filtered = filtered.filter(log => log.agent === filter.agent);
    }

    if (filter?.level) {
      filtered = filtered.filter(log => log.level === filter.level);
    }

    if (filter?.limit) {
      filtered = filtered.slice(-filter.limit);
    }

    return filtered;
  }

  getStats(): {
    totalLogs: number;
    byLevel: Record<LogLevel, number>;
    byAgent: Record<string, number>;
    averageDuration: number;
  } {
    const byLevel = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0,
    };

    const byAgent: Record<string, number> = {};
    let totalDuration = 0;
    let durationCount = 0;

    for (const log of this.logs) {
      byLevel[log.level]++;
      byAgent[log.agent] = (byAgent[log.agent] || 0) + 1;

      if (log.duration) {
        totalDuration += log.duration;
        durationCount++;
      }
    }

    return {
      totalLogs: this.logs.length,
      byLevel,
      byAgent,
      averageDuration: durationCount > 0 ? totalDuration / durationCount : 0,
    };
  }

  clear(): void {
    this.logs = [];
  }
}

export const agentLogger = new AgentLogger();
