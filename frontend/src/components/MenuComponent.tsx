import { NavLink } from "react-router-dom"

const MenuComponent = () => {
  return <div className="grid lg:grid-cols-2 md:grid-cols-1 min-h-screen shadow-xl">
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-9xl">Kaboot</h1>
      <h3>by sebastian tran</h3>
    </div>
    
    <div className="flex flex-col justify-center items-center gap-3 h-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 text-white animate-gradient">
      <NavLink to={"/join"}>
      <h2 className="text-5xl hover:scale-110 transition delay-150 duration-300 ease-in-out">Join</h2>
      </NavLink>

      <NavLink to={"/create"}>
      <h2 className="text-5xl hover:scale-110 transition delay-150 duration-300 ease-in-out">Create Game</h2>
      </NavLink>

      <h3>Rio de Janeiro</h3>
    </div>
  </div>
}

export default MenuComponent