import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GamePage } from "./GamePage";
import signalRService from "../services/SignalRService";

type UserConnection = {
    username : string,
    score : number
}

export const GameLobbyHub = () => {
 
    const updatePin = (pin : string) => {
        console.log("Pin set!: " + pin)
        setPin(pin)
    }

    const updatePlayersList = (users : UserConnection [] ) => {
        console.log(users)
        setUsers(users)
    }

    useEffect(() => {

        signalRService.CreateEventListener("CreateLobby", updatePin)

        signalRService.CreateEventListener("Players", updatePlayersList)

        const CreateLobby = async () => {
            await signalRService.Invoke("CreateLobby")
        };

        CreateLobby()

        return () => {
            signalRService.RemoveEventListener("CreateLobby")
            signalRService.RemoveEventListener("Players")
        }

    }, []);

    const location = useLocation();
    const questions = location.state
    const [pin, setPin] = useState <string> ("");
    const [users, setUsers] = useState <UserConnection[]> ([]);

    const [gameStarted, setGameStarted] = useState(false)

    const handleStartGame = async () => {
        setGameStarted(true)
        
        await signalRService.Invoke("SendToPlayers", "StartGame", [])
    }

    return !gameStarted ? 
        <div className="grid lg:grid-cols-2 md:grid-cols-1 min-h-screen shadow-xl">
            <div className="flex flex-col justify-center items-center h-full gap-6">
                <h2 className="text-5xl">Lobby!</h2> 
                <h1 className="text-9xl">{pin}</h1>
                <button className="4xl" onClick={() => handleStartGame()}>Start Game</button>
            </div>

            <div className="p-5 flex flex-col justify-center items-center h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient">
                <div className="min-w-full grid grid-cols-4 gap-4">
                    {users.map(user => (
                        <div
                            key={user.username}
                            className="shadow-xl truncate border border-white rounded-lg px-4 py-2 bg-white text-black text-2xl flex justify-center items-center"
                        >
                            {user.username}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    :
        <GamePage questions={questions}/>
}