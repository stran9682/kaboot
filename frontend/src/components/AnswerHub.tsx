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
        !finished ? <div className="gap-5 h-screen p-10 flex flex-col justify-center items-center bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 text-white animate-gradient">
            <h1 className="text-7xl text-shadow-2xs border border-white rounded-lg px-10 py-5 bg-white text-black">Get Ready!</h1>
        </div>   
        :
            <h1>Congrats!! Thanks for playing</h1>
}