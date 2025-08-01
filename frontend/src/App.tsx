import { useState } from 'react'
import './App.css'
import MenuComponent from './components/MenuComponent';
import { useSignalR } from "./components/SignalRConnection"

function App() {

  const [menuState, setMenuState] = useState(0);
  const { invokeMethod, registerListener } = useSignalR("http://localhost:5285/game");

  const joinLobby = async (username: string, lobby: string) => {
    registerListener("JoinLobby", (user, message) => {
      console.log("message:", message);
    });

    try {
      await invokeMethod("JoinLobby", { username, lobby });
    } catch (e) {
      console.log(e);
    }
  };

  var counter = 0;

  const createLobby = async (setPin: (pin: string) => void) => {
    registerListener("CreateLobby", (pin: string) => {
      counter += 1;
      console.log(counter)

      setPin(pin)
    });

    try {
      await invokeMethod("CreateLobby");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1 onClick={() => setMenuState(0)}>Kaboot</h1>
      <MenuComponent setMenuState={setMenuState} menu={menuState} joinLobby={joinLobby} createLobby={createLobby}/>
    </>
  )
}
export default App
