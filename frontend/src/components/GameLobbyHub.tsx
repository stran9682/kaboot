import { useState } from "react";
import { useLocation } from "react-router-dom";
import { GamePage } from "./GamePage";

export const GameLobbyHub = () => {

    const location = useLocation();
    const questions = location.state

    const [gameStarted, setGameStarted] = useState(false)

    return !gameStarted ? 
        <>
            <h1>Lobby!</h1> 
            <button onClick={() => setGameStarted(true)}>Start Game</button>
        </>
    :
        <GamePage questions={questions}/>
}