import './App.css'
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import MenuComponent from './components/MenuComponent';
import WaitingRoom from './components/waitingroom';
import {CreateGame} from './components/CreateGame';
import { GamePage } from './components/GamePage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<MenuComponent/>}/>
          <Route path ="/create" element={<CreateGame/>}/>
          <Route path ="/join" element={<WaitingRoom/>}/>
          <Route path ="/game" element={<GamePage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
