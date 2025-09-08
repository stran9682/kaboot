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

        signalRService.CreateEventListener("StartGame", () => {navigate("/player")});

        signalRService.CreateEventListener("ConfirmJoin", () => {setJoinedGame(true)})

        return () => {
            signalRService.RemoveEventListener("ConfirmJoin")
            signalRService.RemoveEventListener("StartGame")
        }
    }, [])

    const [user, setUser] = useState <string> ("");

    const [pin, setPin] = useState <string> ("");

    const [joinedGame, setJoinedGame] = useState (false)

    return <div className="grid lg:grid-cols-2 md:grid-cols-1 min-h-screen">
       

        <div className="flex flex-col justify-center items-center h-full">
             <NavLink to="/">
                <h1 className="text-9xl">Kaboot</h1>
            </NavLink>
            
            <h3>by sebastian tran</h3>
        </div>
        
        <div className="shadow-xl flex flex-col justify-center items-center gap-3 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient">
            { !joinedGame ? 
                <form
                    className="shadow-2xl flex flex-col justify-center items-center bg-white text-black p-5 rounded-lg min-w-[350px] min-h-[250px] gap-2"
                    onSubmit={e => { e.preventDefault(); joinLobby(user, pin) }}
                >
                    <div>
                        <input
                            className="w-full p-3 rounded border border-gray-300 mb-2"
                            placeholder="name"
                            onChange={e => setUser(e.target.value)}
                        />
                        <input
                            className="w-full p-3 rounded border border-gray-300 mb-4"
                            placeholder="lobby"
                            onChange={e => setPin(e.target.value)}
                        />
                    </div>
                    <button
                        className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
                        type="submit"
                    >
                        Join!
                    </button>
                </form>
            :
                <h2 className="text-5xl">You're in, {user}!</h2>
            }
        </div>
    </div> 
}

export default WaitingRoom