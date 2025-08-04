import { useState } from "react";
import { NavLink } from "react-router-dom";

const joinLobby = (username : string, lobby : string) => {

}

const WaitingRoom = () => {

    const [user, setUser] = useState <string> ("");

    const [lobby, setLobby] = useState <string> ("");

    return <>
        <NavLink to="/">
            <h1>Kaboot</h1>
        </NavLink>

        <form onSubmit={ e => { e.preventDefault(); joinLobby(user, lobby)}}>
            <input placeholder="name" onChange={e => setUser(e.target.value)}></input>

            <input placeholder="lobby" onChange={e => setLobby(e.target.value)}></input>

            <button type="submit">Join!</button>
        </form>
    </> 
}

export default WaitingRoom