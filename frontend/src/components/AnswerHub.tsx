import { useEffect, useState } from "react"
import signalRService from "../services/SignalRService"
import type { Question } from "./CreateGame"
import { AnswerComponent } from "./AnswerComponent";

export const AnswerHub = () => {
    
    const [question, setQuestion] = useState<Question | undefined>(undefined);
    const [answering, setAnswering] = useState(false);
    const [finished, setFinished] = useState(false)

    useEffect(() => {
        const handleSetAnswering = (question: Question[]) => {
            setAnswering(true);
            setQuestion(question[0]);
            
            console.log("Recieved question: ")
            console.log(question)
        }


        signalRService.CreateEventListener("answerscreen", handleSetAnswering)
        signalRService.CreateEventListener("nextquestion", () => setAnswering(false))
        signalRService.CreateEventListener("finalquestion", () => {setAnswering(false); setFinished(true)})

        return () => {
            signalRService.RemoveEventListener("answerscreen")
            signalRService.RemoveEventListener("nextquestion")
            signalRService.RemoveEventListener("finalquestion")
        }
    }, [])

    console.log(finished)

    return answering ? 
        <AnswerComponent question={question}/>
    :
        !finished ? 
            <h1>Get ready!</h1>
        :
            <h1>Congrats!! Thanks for playing</h1>
}