import { NavLink } from "react-router-dom";
import FileUpload from "./FileUpload";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export type Question = {
    Question: string
    Time: number
    Answers: string []
    CorrectIndex: number
}

export const CreateGame = () => {

    const [gameSelected, setGameSelected] = useState<Question[] | null>(null);
    const navigate = useNavigate();

    return <>
        <NavLink to="/">
            <h1>Kaboot</h1>
        </NavLink>

        <h2>Upload File!</h2>
        <FileUpload setGameSelected = {setGameSelected}/>
        
        <h2>Premade</h2>
        Coming soon!

        {gameSelected && <>
            {gameSelected.map(question => <li>{question.Question}</li>)}
            <button onClick={() => navigate("/game", {state: gameSelected})}>Start Game</button>
        </>}
    </>
}