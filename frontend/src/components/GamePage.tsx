import { useState } from "react";
import { QuestionComponent } from "./QuestionComponent";
import type { Question } from "./CreateGame";

export const GamePage = ({questions} : {questions : Question[]}) => {
    const [index, setIndex] = useState(0);
    const [displayLeaderboard, setDisplayLeaderboard] = useState(false);

    // const location = useLocation();
    // const questions = location.state

    const changePage = () => {
        if (displayLeaderboard){
            setDisplayLeaderboard(false)
            setIndex(index+1)
        }
        else {
            setDisplayLeaderboard(true)
        }
    }

    return <>
        <button onClick={() => changePage()}>Continue</button>

        {index}

        {!displayLeaderboard ? 
            <QuestionComponent question={questions[index]}/> :
            <h1>Leaderboard!</h1>
        }
    </>
}