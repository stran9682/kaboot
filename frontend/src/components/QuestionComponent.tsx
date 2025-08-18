import type { Question } from "./CreateGame";
import signalRService from "../services/SignalRService";
import { useEffect, useState } from "react";

export const QuestionComponent = (
    {question, changePage, updateSubmittedAnswers} : 
    {question: Question, changePage : () => void, updateSubmittedAnswers : (index : number) => void}) => {
    
    const [time, setTime] = useState(question.time + 3);
    const [displayQuestion, setDisplayQuestion] = useState(false);
    const [submissions, setSubmissions] = useState(0);

    useEffect(() => {
        signalRService.CreateEventListener("GetSubmission", (submittedIndex : number) => {
            setSubmissions(submissions + 1)
            updateSubmittedAnswers(submittedIndex)
            
            console.log("Got a submission! : " + submittedIndex)
        });

        return () => {
            signalRService.RemoveEventListener("GetSubmission");
        }
    }, [])

    useEffect(() => {

        if (time == 0){
            changePage()
        } 
        else if (time == question.time){

            const alertPlayers = async () => {
                await signalRService.Invoke("SendToPlayers", "AnswerScreen", [question])
            }

            alertPlayers()

            setDisplayQuestion(true);
        }

        const interval = setInterval(() => {
            setTime((t) => t - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time])

    return displayQuestion ? <>
        <h1>{question.question}</h1>

        <h2>{time}</h2>

        <h2>{submissions} submitted!</h2>
        
        {question.answers.map(answer => <li key={answer}>{answer}</li>)}
    </> : <>
        <h1>{question.question}</h1>

        <h2>Get ready to answer!</h2>
    </>
}