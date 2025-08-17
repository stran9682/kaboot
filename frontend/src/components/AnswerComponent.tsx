import { useEffect, useState } from "react"
import type { Question } from "./CreateGame";
import signalRService from "../services/SignalRService";

export const AnswerComponent = ({question} : {question : Question | undefined}) => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGraded, setIsGraded] = useState(false);
    const [submittedAnswer, setSubmittedAnswer] = useState(-1);

    const handleSubmit = (answer : number) => {
        setSubmittedAnswer(answer);
        setIsSubmitted(true);
        // grade question
    }

    useEffect(() => {
        signalRService.CreateEventListener("showgrade", () => {
            setIsGraded(true)
            console.log("show grade")
        })

        return () => {
            signalRService.RemoveEventListener("showgrade")
        }
    }, []) 

    if (question == undefined){
        return <h1>Ooops, this shouldn't run.</h1>
    }

    return !isGraded ? 

        !isSubmitted ? <>
            {Array.from({ length: question.answers.length }, (_, i) => (
                <div key={i} onClick={() => handleSubmit(i)}>{i + 1}</div>
            ))}
        </> :
            <h1>Submitted!</h1> 
    :
        submittedAnswer == question.correctindex ? <>
            <h1>Hoorayy!</h1>
        </> : <> 
            <h1>idiot...</h1>
        </> 
}