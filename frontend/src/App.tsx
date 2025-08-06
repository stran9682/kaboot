import './App.css'
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import MenuComponent from './components/MenuComponent';
import WaitingRoom from './components/waitingroom';
import {CreateGame} from './components/CreateGame';
import { GameLobbyHub } from './components/GameLobbyHub';
import signalRService from './services/SignalRService';

await signalRService.StartConnection()

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<MenuComponent/>}/>
          <Route path ="/create" element={<CreateGame/>}/>
          <Route path ="/join" element={<WaitingRoom/>}/>
          <Route path ="/game" element={<GameLobbyHub/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
