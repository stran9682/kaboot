import { useState } from "react";

const WaitingRoom = ({ joinLobby } : { joinLobby : (username : string, lobby : string) => void}) => {

    const [user, setUser] = useState <string> ("");

    const [lobby, setLobby] = useState <string> ("");

    return <form onSubmit={ e => { e.preventDefault(); joinLobby(user, lobby)}}>
        <input placeholder="name" onChange={e => setUser(e.target.value)}></input>

        <input placeholder="lobby" onChange={e => setLobby(e.target.value)}></input>

        <button type="submit">Join!</button>
    </form>

}

export default WaitingRoom