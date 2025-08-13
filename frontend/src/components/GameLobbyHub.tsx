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
        console.log("Pin set!")
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
        
        await signalRService.Invoke("StartGame")
    }

    return !gameStarted ? 
        <>
            <h2>Lobby!</h2> 
            <h1>{pin}</h1>
            <button onClick={() => handleStartGame()}>Start Game</button>

            {users.map(user => <li key={user.username}>{user.username}</li>)}
        </>
    :
        <GamePage questions={questions}/>
}