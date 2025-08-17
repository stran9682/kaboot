import { useState } from "react";
import { QuestionComponent } from "./QuestionComponent";
import type { Question } from "./CreateGame";
import { LeaderboardComponent } from "./LeaderboardComponent";
import signalRService from "../services/SignalRService";

export const GamePage = ({questions} : {questions : Question[]}) => {
    const [index, setIndex] = useState(0);
    const [displayLeaderboard, setDisplayLeaderboard] = useState(false);

    const nextQuestion = async () => {
        if (index != questions.length){
            await signalRService.Invoke("SendToPlayers", "NextQuestion", [])
        }
        else {
            // final placement
        }       
    }

    const changePage = () => {
        setDisplayLeaderboard(!displayLeaderboard)

        if (displayLeaderboard){
            setIndex(index+1)
            nextQuestion()
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