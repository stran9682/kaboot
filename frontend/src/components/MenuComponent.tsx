import { useEffect, useState } from "react";
import WaitingRoom from "./waitingroom";

const JoinMenu = ({ setMenuState }: { setMenuState: (menu: number) => void }) => (
  <>
    <h2 onClick={() => setMenuState(1)}>Join Game</h2>
    <h2 onClick={() => setMenuState(2)}>Create Game</h2>
  </>
);

const JoinGame = ({ joinLobby }: { joinLobby: (username: string, lobby: string) => Promise<void> }) => (
  <WaitingRoom joinLobby={joinLobby} />
);

const CreateGame = ({ createLobby }: { createLobby: (setPin: (pin: string) => void) => Promise<void> }) => {
  const [pin, setPin] = useState("");

  useEffect(() => {
    createLobby(setPin);
  }, [createLobby]);

  return <h2>{pin}</h2>;
};

const MenuComponent = ({
  setMenuState,
  menu,
  joinLobby,
  createLobby,
}: {
  setMenuState: (menu: number) => void;
  menu: number;
  joinLobby: (username: string, lobby: string) => Promise<void>;
  createLobby: (setPin: (pin: string) => void) => Promise<void>
}) => {
  switch (menu) {
    case 0:
      return <JoinMenu setMenuState={setMenuState} />;
    case 1:
      return <JoinGame joinLobby={joinLobby} />;
    case 2:
      return <CreateGame createLobby={createLobby} />;
    default:
      return null;
  }
};

export default MenuComponent