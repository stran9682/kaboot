import { useState } from "react";
import { QuestionComponent } from "./QuestionComponent";
import type { Question } from "./CreateGame";
import { LeaderboardComponent } from "./LeaderboardComponent";
import signalRService from "../services/SignalRService";

export const GamePage = ({questions} : {questions : Question[]}) => {
    const [index, setIndex] = useState(0);
    const [displayLeaderboard, setDisplayLeaderboard] = useState(false);
    const [submittedAnswers, setSubmittedAnswers] = useState<number[]>(Array(questions[0].answers.length).fill(0))

    console.log(submittedAnswers.length)

    const nextQuestion = async () => {
        if (index+1 != questions.length){
            await signalRService.Invoke("SendToPlayers", "NextQuestion", [])
        }
        else {
            await signalRService.Invoke("SendToPlayers", "FinalQuestion", [])
        }       
    }

    const updateSubmittedAnswers = (index : number) => {
        const nextCounters = submittedAnswers.map((c, i) => {
            if (i === index) {
                return c + 1;
            } else {
                return c;
            }
        });
        setSubmittedAnswers(nextCounters);
    }

    const changePage = () => {
        setDisplayLeaderboard(!displayLeaderboard)

        if (displayLeaderboard){
            setIndex(index+1)
           
            if (index+1 < questions.length){
                setSubmittedAnswers(Array(questions[index+1].answers.length).fill(0))
            }

            nextQuestion()
        }
    }
    
    return questions.length != index ? 
        !displayLeaderboard ? 
            <QuestionComponent question={questions[index]} changePage={changePage} updateSubmittedAnswers={updateSubmittedAnswers}/> 
        : 
            <LeaderboardComponent question={questions[index]} changePage={changePage} submittedAnswers={submittedAnswers}/>
        
    : <>
        <h1>All done! Thanks for playing</h1>
    </>
}