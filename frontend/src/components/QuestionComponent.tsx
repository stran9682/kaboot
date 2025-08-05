import type { Question } from "./CreateGame";

export const QuestionComponent = ({question} : {question: Question}) => {
    return <>
        <h1>{question.Question}</h1>
        
        {question.Answers.map(answer => <li>{answer}</li>)}
    </>
}