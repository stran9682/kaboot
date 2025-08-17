import { useEffect, useState } from "react"
import signalRService from "../services/SignalRService"
import type { Question } from "./CreateGame"
import { AnswerComponent } from "./AnswerComponent";

export const AnswerHub = () => {
    
    const [question, setQuestion] = useState<Question | undefined>(undefined);
    const [answering, setAnswering] = useState(false);

    useEffect(() => {
        const handleSetAnswering = (question: Question[]) => {
            setAnswering(true);
            setQuestion(question[0]);
            
            console.log("Recieved question: ")
            console.log(question)
        }

        const nextQuestion = () => {
            setAnswering(false);
        }

        signalRService.CreateEventListener("answerscreen", handleSetAnswering)
        signalRService.CreateEventListener("nextquestion", nextQuestion)

        return () => {
            signalRService.RemoveEventListener("answerscreen")
            signalRService.RemoveEventListener("nextquestion")
        }
    }, [])

    return answering ? 
        <AnswerComponent question={question}/>
    :
        <h1>Get ready!</h1>
}