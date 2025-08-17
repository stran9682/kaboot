import { useEffect, useState } from "react"
import type { Question } from "./CreateGame"
import signalRService from "../services/SignalRService";

export const LeaderboardComponent = ({question, changePage} : {question: Question, changePage : () => void}) => {

    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const showGrade = () => {
        setShowLeaderboard(true);
    }

    useEffect (() => {
        const revealGrade = async () => {
            await signalRService.Invoke("SendToPlayers", "ShowGrade", [])
        }
        
        revealGrade();
    }, [])

    return showLeaderboard ? <>
        <h1>Leaderboard!</h1>
        <button onClick={() => changePage()}>Continue</button>
    </> : <>
        <h1>{question.question}</h1>

        <h2>{question.answers[question.correctindex]}</h2>

        <button onClick={() => showGrade()}>Continue</button>
    </>
}