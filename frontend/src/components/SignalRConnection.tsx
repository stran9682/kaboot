import { useState, useEffect, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

type EventCallback = (...args: any[]) => void;

export function useSignalR (hubUrl : string){
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const conn = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(conn);

        return () => {
            conn.stop();
        };
    }, [hubUrl]);
    
    const startConnection = useCallback(async () => {
        if (connection && connection.state === "Disconnected") {
            await connection.start();
        }

    }, [connection]);

    const invokeMethod = useCallback(async (method: string, ...args: any[]) => {
        if (!connection) return;
        
        await startConnection();
        await connection.invoke(method, ...args);
    
    }, [connection, startConnection]);

    const registerListener = useCallback((event: string, callback: EventCallback) => {
        if (!connection) return;
        
        connection.on(event, callback);

    }, [connection]);

  return { connection, invokeMethod, registerListener };
}