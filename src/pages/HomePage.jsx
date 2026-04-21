import { Link, useSearchParams } from "react-router-dom";
import battleshipIcon from "../assets/images/battleship.png";
import tttIcon from "../assets/images/ttt.png";
import wordleIcon from "../assets/images/wordle.png";

export function HomePage(){
  const [params, setParams] = useSearchParams();
  const search = (params.get('search') || '').toLowerCase();

  const popularGames = [
    { label: "Battleship", to: "/game/battleship", image: battleshipIcon },
    { label: "Tic Tac Toe", to: "/game/tic-tac-toe", image: tttIcon },
    { label: "Wordle", to: "/game/wordle", image: wordleIcon },
  ];

  const games = [
    { key: "rps", name: "Rock Paper Scissors", description: "A simple game of Rock Paper Scissors" },
    { key: "tic-tac-toe", name: "Tic Tac Toe", description: "A simple game of Tic Tac Toe" },
    { key: "wordle", name: "Wordle", description: "Guess the 5 letter word in 6 tries" },
    { key: "hangman", name: "Hangman", description: "Guess the word before the man is hanged" },
    { key: "battleship", name: "Battleship", description: "Sink all your opponent's ships before they sink yours" },
  ];
  
  const filteredGames = games.filter(game => (
    !search || game.name.toLowerCase().includes(search)
  ))

  return(<>
    <section>
      <h2>Available Games</h2>
      <p>Pick from one of our popular games:</p>

      <div backgroundColor="#f0f0f0">
        <div className="popular-games" aria-label="Quick game shortcuts">
          {popularGames.map((game) => (
            <Link key={game.label} to={game.to} className="game-button">
              <img src={game.image} alt="image" className="game-button-image" /><br></br>
              <span>{game.label}</span>
            </Link>
          ))}
        </div>
      </div>
      </section>

      <section>
      <h2>Find a game</h2>
      <p>Don't see what you're looking for? Search all games below:</p>

      <input
        id="game-search"
        type="text"
        placeholder="Search games..."
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          if (value.trim() === "") {
            setParams({});
          } else {
            setParams({ search: value });
          }
        }}
      />

      <ul style={{ textAlign: "left"}}>
        {filteredGames.map((game) => (
          <li key={game.key}>
            <Link to={`/game/${game.key}`}>
              {game.name}
            </Link>
            <p>{game.description}</p>
          </li>
        ))}
      </ul>
    </section>

    <section>
      <h2>About</h2>
      <p>Welcome to the Games Lobby! Here you can find a variety of classic games to play.</p>
      <p>Created by:</p>
      <ul>
        <li>Aneesh Palande</li>
        <li>Hudson DeGrace</li>
      </ul>
      <p>For IT3049C - Web Game Development</p>
      <p>Spring 2026 - Professor Gilany</p>
    </section>


    </>
  );
}