import { useState } from "react"

export const AnswerComponent = ({answers, setSubmittedAnswer} : {answers: number,  setSubmittedAnswer : (answer : number) => void}) => {

    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (answer : number) => {
        setSubmittedAnswer(answer);
        setIsSubmitted(true);
    }

    return isSubmitted ? 
        <>
            {Array.from({ length: answers }, (_, i) => (
                <div key={i} onClick={() => handleSubmit(i)}>{i + 1}</div>
            ))}
        </>
    :
        <h1>Submitted!</h1>

}