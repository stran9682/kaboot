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

    const colors = ["#48a9a6", "#d4b483", "#52489c", "#083d77"];

    useEffect(() => {
        question.answers.forEach((answer, index) => {
            const el = document.getElementById(answer);
            if (el) {
                // You may want to use Tailwind classes instead of direct style assignment
                el.style.backgroundColor = colors[index];
            }
        });
    }, [displayQuestion]);

    return displayQuestion ? <div className="h-screen">
        <div className="h-2/3 p-10 flex flex-col  items-center bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 text-white animate-gradient">
            <h1 className="text-7xl text-shadow-2xs border border-white rounded-lg px-10 py-5 bg-white text-black">{question.question}</h1>

            <h2>{time}</h2>

            <h2>{submissions} submitted!</h2>
        </div>
        
        <div className="h-1/3 bg-white shadow-2xl grid grid-cols-2 gap-6 p-8">
            {question.answers.map(answer => (
                <div
                    id={answer}
                    key={answer}
                    className="h-full flex items-center justify-center rounded-xl text-white text-3xl font-semibold shadow-2xl"
                >
                    {answer}
                </div>
            ))}
        </div>
    </div> : <div className="h-screen">        
        <div className="gap-5 h-screen p-10 flex flex-col justify-center items-center bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 text-white animate-gradient">
            <h1 className="text-7xl text-shadow-2xs border border-white rounded-lg px-10 py-5 bg-white text-black">{question.question}</h1>           
            <h2 className="text-4xl">Get ready to answer!</h2>
            <h2 className="text-8xl">{time-question.time}</h2>
        </div>
    </div>
}