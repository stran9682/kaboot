import { useState } from 'react'
import './App.css'
import WaitingRoom from "./components/waitingroom"
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const MenuComponent = ({setMenuState, menu, joinLobby}: {setMenuState : (menu : number) => void, menu : number, joinLobby : (username: string, lobby: string) => Promise<void>}) => {
  if (menu === 0){
    return <h2 onClick={() => setMenuState(1)}>Join Game</h2>
  }
  else if (menu === 1){
    return <WaitingRoom joinWaitingRoom={joinLobby}/>
  }
  return null;
}

function App() {

  const [connection, setConnection] = useState<HubConnection>();

  const [menuState, setMenuState] = useState (0);

  const joinLobby = async (username : string, lobby : string)  => {
    try {
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5285/game")
        .configureLogging(LogLevel.Information)
        .build();

      conn.on("JoinLobby", (username, message) => {
        console.log("message: ", message)
      })      

      await conn.start();
      await conn.invoke("JoinLobby", {username, lobby})

      setConnection(conn)

    } catch(e) {
      console.log(e);
    }
  }
  
  return (
    <>
      <h1 onClick={() => setMenuState(0)}>Kaboot</h1>
      <MenuComponent setMenuState={setMenuState} menu={menuState} joinLobby={joinLobby} />
    </>
  )
}
export default App
