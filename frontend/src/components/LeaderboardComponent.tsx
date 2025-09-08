import { useEffect, useState } from "react"
import type { Question } from "./CreateGame"
import signalRService from "../services/SignalRService";
import DoughnutDistribution from "./GraphComponent";
import Leaderboard from "./LeaderboardGraph";

export type UserInfo = {
    username : string,
    score : number,
    connectionid : string
}

export const LeaderboardComponent = ({question, changePage, submittedAnswers, special} : {question: Question, changePage : () => void, submittedAnswers : number [], special : boolean}) => {

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
            players.sort((a, b) => b.score - a.score)
            setPlayers(players)
        })
        
        revealGrade();

        const colors = ["#48a9a6", "#d4b483", "#52489c", "#083d77"];
        question.answers.forEach((answer, index) => {
            const el = document.getElementById(answer);
            if (el) {
                el.style.backgroundColor = colors[index];
            }
        });

        return () => {
            signalRService.RemoveEventListener("GetPlayers")
        }
    }, [])

    return showLeaderboard ? !special ? <div className="grid lg:grid-cols-3 md:grid-cols-1 min-h-screen shadow-xl">
        <div className="flex flex-col col-span-1 justify-center items-center h-full">
            <h1 className="text-7xl">Leaderboard!</h1>

            <button className="text-6xl" onClick={() => changePage()}>Continue</button>
        </div>

        <div className="col-span-2 flex flex-col justify-center items-center gap-3 h-full bg-white">
            <Leaderboard userInfo={players.slice(0, 5)}/>        
        </div>
    </div> : <div className="gap-5 h-screen p-10 flex flex-col justify-center items-center bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 text-white animate-gradient">

        <h1 className="text-7xl text-shadow-2xs border border-white rounded-lg px-10 py-5 bg-white text-black">Congrats, {players[0]?.username}! winner winner chicken dinner</h1>

        {players.slice(0, 5).map(player => <h1 className="text-3xl">{player.username}, {player.score}</h1>)}


    </div>  : <div className="h-screen">
        <div className="gap-5 h-2/3 p-10 flex flex-col  items-center bg-gradient-to-b from-indigo-300 via-purple-300 to-pink-300 text-white animate-gradient">
            <h1 className="text-7xl text-shadow-2xs border border-white rounded-lg px-10 py-5 bg-white text-black">{question.question}</h1>

            <div className="w-full max-w-xs mx-auto">
                <DoughnutDistribution submittedAnswers={submittedAnswers} />
            </div>

            <button className="text-3xl"onClick={() => showGrade()}>Continue</button>
        </div>
        
        <div className="h-1/3 bg-white shadow-2xl grid grid-cols-2 gap-6 p-8">
            {question.answers.map((answer, index) => (
                <div
                    id={answer}
                    key={answer}
                    className="h-full flex items-center justify-center rounded-xl text-white text-3xl font-semibold shadow-2xl"
                >
                    {question.correctindex === index ? answer : null}
                </div>
            ))}
        </div>
    </div>      
}