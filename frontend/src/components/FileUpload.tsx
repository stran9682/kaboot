import { useState } from "react";
import type { Question } from "./CreateGame";

const FileUpload = ({setGameSelected} : {setGameSelected : (selected : Question[] | null) => void}) => {
    const [file, setFile] = useState<File | null> (null) ;

    const [status, setStatus] = useState("")

    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (file) {
            setStatus('converting')

            const formData = new FormData()
            formData.append('file', file)

            try {
                const result = await fetch('http://localhost:5285/convert', {
                    method: 'POST',
                    body: formData
                });

                const data = await result.json();

                console.log(data)

                setGameSelected(data)

                setStatus("success!")
            }
            catch (error) {
                console.error(error)
                setStatus('fail')
            }
        }
    }

    return <>
        <input id="file" type="file" onChange={handleFileChange} />

        {file && (<button onClick={handleUpload}>Upload!</button>)}

        <p>{status}</p>
    </>
}

export default FileUpload