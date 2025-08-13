import { useState } from "react"
import type { Question } from "./CreateGame"

export const LeaderboardComponent = ({question, changePage} : {question: Question, changePage : () => void}) => {

    const [showLeaderboard, setShowLeaderboard] = useState(false);

    return showLeaderboard ? <>
        <h1>Leaderboard!</h1>
        <button onClick={() => changePage()}>Continue</button>
    </> : <>
        <h1>{question.Question}</h1>

        <h2>{question.Answers[question.CorrectIndex]}</h2>

        <button onClick={() => setShowLeaderboard(true)}>Continue</button>
    </>
}