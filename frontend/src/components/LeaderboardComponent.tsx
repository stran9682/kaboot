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

        const colors = ["#48a9a6", "#d4b483", "#52489c", "#083d77"];
        question.answers.forEach((answer, index) => {
            const el = document.getElementById(answer);
            if (el) {
                // You may want to use Tailwind classes instead of direct style assignment
                el.style.backgroundColor = colors[index];
            }
        });

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
    </> :

    <div className="h-screen">
        <div className="h-2/3 p-10 flex flex-col  items-center bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 text-white animate-gradient">
            <h1 className="text-7xl text-shadow-2xs border border-white rounded-lg px-10 py-5 bg-white text-black">{question.question}</h1>

            {submittedAnswers.map(
                (answer, index) => <h2 key={`${index}`}>{question.answers[index]} : {answer}</h2>
            )}

            <button onClick={() => showGrade()}>Continue</button>
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
    </div>      
}