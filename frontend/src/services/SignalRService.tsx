import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export class SignalRService {

    private static _instance: SignalRService | undefined;

    private conn: HubConnection | null = null;

    constructor() {
        if (SignalRService._instance) {
            return SignalRService._instance
        }

        SignalRService._instance = this;

        try {
            this.conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5065/chat")
                .configureLogging(LogLevel.Information)
                .withAutomaticReconnect()
                .build();
        }
        catch (e){
            console.log(e)
        }
    }

    invoke (method : string, param : any) {
        try {
            this.conn?.invoke(method, param)
        }
        catch (e){
            console.log(e)
        }
    }
}