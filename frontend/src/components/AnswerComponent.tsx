import { useEffect, useState } from "react"
import type { Question } from "./CreateGame";
import signalRService from "../services/SignalRService";

export const AnswerComponent = ({question} : {question : Question | undefined}) => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGraded, setIsGraded] = useState(false);
    const [submittedAnswer, setSubmittedAnswer] = useState(-1);

    const [timerActive, setTimerActive] = useState(true);
    const [time, setTime] = useState(question?.time)

    const [place, setPlace] = useState(-1);

    const handleSubmit = async (answer : number) => {
        setSubmittedAnswer(answer);
        setIsSubmitted(true);
        setTimerActive(false);

        score = 0;

        if (answer == question!.correctindex){
            var score = 100 - (100*(question!.time - time!)/question!.time)
        }

        await signalRService.Invoke("AddToScore", score, answer)
    }

    useEffect(() => {
        signalRService.CreateEventListener("showgrade", () => {
            setIsGraded(true)
            console.log("show grade")
        })

        signalRService.CreateEventListener("getplayerplacements", (place : number) => {
            setPlace(place)
        })

        return () => {
            signalRService.RemoveEventListener("showgrade")
        }
    }, []) 

    useEffect(() => {

        if (!timerActive){
            return;
        }

        const interval = setInterval(() => {
            setTime((t) => t! - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [time])

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
    : <>
        { submittedAnswer == question.correctindex ? <>
            <h1>Hoorayy!</h1>
            <h2>+{100 - (100*(question!.time - time!)/question!.time)}</h2>
        </> : <> 
            <h1>idiot...</h1>
            <h2>+0</h2>
        </> }

        { place >= 5 ? 
            <h1>You are currently in {place} place!</h1>
        :
            <h1>You are on the podium!</h1>
        }
    </>
}