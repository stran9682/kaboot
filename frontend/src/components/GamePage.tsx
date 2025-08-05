import { useState } from "react";
import { useLocation } from 'react-router-dom';
import { QuestionComponent } from "./QuestionComponent";
import type { Question } from "./CreateGame";

export const GamePage = () => {
    const [index, setIndex] = useState(-1);
    const location = useLocation();
    const questions = location.state

    return <>
        <button onClick={() => setIndex(index+1)}></button>

        {questions.map((question: Question) => <QuestionComponent question={question}/>)}
    </>
}