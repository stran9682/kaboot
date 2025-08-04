import { NavLink } from "react-router-dom"

const MenuComponent = () => {
  return <>
    <h1>Kaboot</h1>

    <NavLink to={"/join"}>
      <h2>Join</h2>
    </NavLink>

    <NavLink to={"/create"}>
      <h2>Create Game</h2>
    </NavLink>
  </>
}

export default MenuComponent