import { useEffect, useState } from "react"
import type { Question } from "./CreateGame";
import signalRService from "../services/SignalRService";

export const AnswerComponent = ({question} : {question : Question | undefined}) => {

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isGraded, setIsGraded] = useState(false);
    const [submittedAnswer, setSubmittedAnswer] = useState(-1);
    const [score, setScore] = useState(0);

    const [timerActive, setTimerActive] = useState(true);
    const [time, setTime] = useState(question?.time)

    const [place, setPlace] = useState(-1);

    const handleSubmit = async (answer : number) => {
        setSubmittedAnswer(answer);
        setIsSubmitted(true);
        setTimerActive(false);

        var update = 0;
        if (answer == question!.correctindex){
            update = Math.trunc(1000 - (1000*(question!.time - time!)/question!.time))
            setScore(update)
        }

        await signalRService.Invoke("AddToScore", update, answer)
    }

    useEffect(() => {
        signalRService.CreateEventListener("showgrade", () => {
            setIsGraded(true)
            console.log("show grade")
        })

        signalRService.CreateEventListener("getplayerplacements", (place : number) => {
            setPlace(place)
        })

        const colors = ["#48a9a6", "#d4b483", "#52489c", "#083d77"];
        question?.answers.forEach((answer, index) => {
            const el = document.getElementById(answer);
            if (el) {
                el.style.backgroundColor = colors[index];
            }
        });

        return () => {
            signalRService.RemoveEventListener("showgrade")
        }
    }, []) 

    useEffect(() => {

        if (!timerActive){
            return;
        }

        const interval = setInterval(() => {
            setTime((t) => t! - 0.1);
        }, 100);

        return () => clearInterval(interval);
    }, [timerActive])

    if (question == undefined){
        return <h1>Ooops, this shouldn't run.</h1>
    }

    return <div className="h-screen">            
        {!isSubmitted ? <div className="h-screen bg-white shadow-2xl grid grid-cols-2 gap-6 p-8">
            {question.answers.map((answer, index) => (
                <div
                    id={answer}
                    key={answer}
                    className="h-full flex items-center justify-center rounded-xl text-white text-3xl font-semibold shadow-2xl"
                    onClick={() => handleSubmit(index)}
                >
                    {index+1}
                </div>
            ))}
        </div> : isGraded ? <>
            {submittedAnswer == question.correctindex ? <div className="gap-5 h-screen p-10 flex flex-col justify-center items-center bg-gradient-to-b from-green-500 via-purple-300 to-emerald-500 text-white animate-gradient">
                <h1 className="text-6xl">Hoorayy!</h1>
                <h2 className="text-4xl">+{score}</h2>
                
                {place >= 5 ? 
                    <h1 className="text-3xl">You are currently in {place} place!</h1>
                :
                    <h1 className="text-3xl">You are on the podium!</h1>
                }
            </div> : <div className="gap-5 h-screen p-10 flex flex-col justify-center items-center bg-gradient-to-b from-red-500 via-pink-300 to-orange-500 text-white animate-gradient"> 
                <h1 className="text-6xl">maybe next time...</h1>
                <h2 className="text-4xl">+0</h2>

                {place >= 5 ? 
                    <h1 className="text-3xl">You are currently in {place} place!</h1>
                :
                    <h1 className="text-3xl">You are on the podium!</h1>
                }

            </div> }    
        </> : <div className="gap-5 h-screen p-10 flex flex-col justify-center items-center bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 text-white animate-gradient">
            <h1 className="text-7xl text-shadow-2xs border border-white rounded-lg px-10 py-5 bg-white text-black">Submitted!</h1>
        </div>   
        }
    </div>
}