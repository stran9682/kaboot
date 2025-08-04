import { NavLink } from "react-router-dom";
import FileUpload from "./FileUpload";

const CreateGame = () => {
    return <>
        <NavLink to="/">
            <h1>Kaboot</h1>
        </NavLink>

        <h2>Upload File!</h2>
        <FileUpload/>
        
        <h2>Premade</h2>
    </>
}

export default CreateGame;