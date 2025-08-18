import { useEffect, useState } from "react"
import type { Question } from "./CreateGame"
import signalRService from "../services/SignalRService";

type UserInfo = {
    username : string,
    score : number,
    connectionid : string
}

export const LeaderboardComponent = ({question, changePage, submittedAnswers} : {question: Question, changePage : () => void, submittedAnswers : number []}) => {

    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [players, setPlayers] = useState<UserInfo[]>([]);

    const showGrade = () => {
        setShowLeaderboard(true);
    }

    useEffect (() => {
        const revealGrade = async () => {
            await signalRService.Invoke("SendToPlayers", "ShowGrade", [])
            await signalRService.Invoke("GetPlayerPlacements")
        }

        signalRService.CreateEventListener("GetPlayers", (players : UserInfo[]) => {
            setPlayers(players)
        })
        
        revealGrade();

        return () => {
            signalRService.RemoveEventListener("GetPlayers")
        }
    }, [])

    return showLeaderboard ? <>
        <h1>Leaderboard!</h1>

        {players.map(
            (player, index) => <h2 key={`${index}`}>{index+1}. {player.username}: {player.score}</h2>
        )}

        <button onClick={() => changePage()}>Continue</button>
    </> : <>
        <h1>{question.question}</h1>

        {submittedAnswers.map(
            (answer, index) => <h2 key={`${index}`}>{question.answers[index]} : {answer}</h2>
        )}

        <button onClick={() => showGrade()}>Continue</button>
    </>
}