import { useState } from "react";
import { QuestionComponent } from "./QuestionComponent";
import type { Question } from "./CreateGame";
import { LeaderboardComponent } from "./LeaderboardComponent";

export const GamePage = ({questions} : {questions : Question[]}) => {
    const [index, setIndex] = useState(0);
    const [displayLeaderboard, setDisplayLeaderboard] = useState(false);

    // const location = useLocation();
    // const questions = location.state

    const changePage = () => {
        setDisplayLeaderboard(!displayLeaderboard)

        if (displayLeaderboard){
            setIndex(index+1)
        }
    }
    
    return questions.length != index ? 
        !displayLeaderboard ? 
            <QuestionComponent question={questions[index]} changePage={changePage}/> 
        : 
            <LeaderboardComponent question={questions[index]} changePage={changePage}/>
        
    : <>
        <h1>All done! Thanks for playing</h1>
    </>
}