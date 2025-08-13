import type { Question } from "./CreateGame";
import signalRService from "../services/SignalRService";
import { useEffect, useState } from "react";

export const QuestionComponent = ({question, changePage} : {question: Question, changePage : () => void}) => {
    
    const [time, setTime] = useState(question.Time + 3);
    const [displayQuestion, setDisplayQuestion] = useState(false);

    useEffect(() => {

        if (time <= 0){
            changePage()
        } 
        else if (time <= question.Time){
            setDisplayQuestion(true);
        }

        const interval = setInterval(() => {
            setTime((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time])
 
    useEffect(() => {
        //signalRService.Invoke("some_method", question)
    }, [])

    return displayQuestion ? <>
        <h1>{question.Question}</h1>

        <h2>{time}</h2>
        
        {question.Answers.map(answer => <li key={answer}>{answer}</li>)}
    </> : <>
        <h1>{question.Question}</h1>

        <h2>Get ready to answer!</h2>
    </>
}