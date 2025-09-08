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
        setSubmittedAnswers(prev =>
            prev.map((num, idx) => (idx === index ? num + 1 : num))
        );
    }

    console.log(submittedAnswers)

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
    
    return !displayLeaderboard ? 
        <QuestionComponent question={questions[index]} changePage={changePage} updateSubmittedAnswers={updateSubmittedAnswers}/> 
    : questions.length != index ? 
        <LeaderboardComponent question={questions[index]} changePage={changePage} submittedAnswers={submittedAnswers} special={questions.length-1 == index }/>
    : <>
        <h1>All done! Thanks for playing</h1>
    </>
}