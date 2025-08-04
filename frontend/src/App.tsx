import './App.css'
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import MenuComponent from './components/MenuComponent';
import WaitingRoom from './components/waitingroom';
import CreateGame from './components/CreateGame';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<MenuComponent/>}/>
          <Route path ="/create" element={<CreateGame/>}/>
          <Route path ="join" element={<WaitingRoom/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
