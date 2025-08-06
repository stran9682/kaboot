import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GamePage } from "./GamePage";
import signalRService from "../services/SignalRService";

export const GameLobbyHub = () => {

    const test = (pin : string) => {
        setPin(pin)
    }

    useEffect(() => {

        signalRService.CreateEventListener("CreateLobby", test)

        const CreateLobby = async () => {
            await signalRService.Invoke("CreateLobby")
        };

        CreateLobby()

        return () => {
            signalRService.RemoveEventListener("CreateLobby")
        }

    }, []);

    const location = useLocation();
    const questions = location.state
    const [pin, setPin] = useState <string> ("");

    const [gameStarted, setGameStarted] = useState(false)

    return !gameStarted ? 
        <>
            <h2>Lobby!</h2> 
            <h1>{pin}</h1>
            <button onClick={() => setGameStarted(true)}>Start Game</button>
        </>
    :
        <GamePage questions={questions}/>
}