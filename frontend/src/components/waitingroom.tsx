import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import signalRService from "../services/SignalRService";

const joinLobby = async (username : string, pin : string) => {
    signalRService.Invoke("JoinLobby", pin, username)
}

const WaitingRoom = () => {

    const navigate = useNavigate();

    useEffect(()=> {
        signalRService.CreateEventListener("EndSession", () => {navigate("/")})

        signalRService.CreateEventListener("ConfirmJoin", () => {setJoinedGame(true)})
    }, [])

    const [user, setUser] = useState <string> ("");

    const [pin, setPin] = useState <string> ("");

    const [joinedGame, setJoinedGame] = useState (false)

    return <>
        <NavLink to="/">
            <h1>Kaboot</h1>
        </NavLink>
        
        { !joinedGame ? 
            <form onSubmit={ e => { e.preventDefault(); joinLobby(user, pin)}}>
                <input placeholder="name" onChange={e => setUser(e.target.value)}></input>

                <input placeholder="lobby" onChange={e => setPin(e.target.value)}></input>

                <button type="submit">Join!</button>
            </form> 
        :
            <h2>You're in!</h2>
        }
    </> 
}

export default WaitingRoom