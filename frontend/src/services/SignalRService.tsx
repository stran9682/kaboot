import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class SignalRService {

    private static _instance: SignalRService | undefined;

    private conn: HubConnection | null = null;

    constructor() {
        console.log("registering singleton")
        if (SignalRService._instance) {
            console.log("service previously registered...")
            return SignalRService._instance
        }

        SignalRService._instance = this;

        try {
            this.conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5285/game")
                .configureLogging(LogLevel.Information)
                .build();
        }
        catch (e){
            console.log(e)
        }
    }

    async StartConnection () {
        await this.conn?.start();
    }
    
    async Invoke (method : string, ...params : any[]) {
        try {
            await this.conn?.invoke(method, ...params)
        }
        catch (e){
            console.log(e)
        }
    }

    private listeners : Set<string> = new Set();

    CreateEventListener (method_name: string, anonymous_function: (... params : any []) => void) {
        if (this.listeners.has(method_name)) return;

        this.conn?.on(method_name, anonymous_function)
        this.listeners.add(method_name);
    }

    RemoveEventListener (method_name : string){
        if (!this.listeners.has(method_name)) return;

        this.conn?.off(method_name)
        this.listeners.delete(method_name)
    }
}

const signalRService = new SignalRService();
export default signalRService;