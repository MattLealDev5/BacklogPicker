import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [games, setGames] = useState([])
  const [gameName, setGameName] = useState('')

  async function search() {
      const res = await fetch(`http://localhost:5678/hltb?gameName=${gameName}&limit=1`)
      const data = await res.json()
      setGames(data)
      console.log(data)
  }


  return (
    <>
      <section id="title">
        <h1>Hello, welcome to BacklogPicker</h1>
        <h3>Enter your Steam ID and this program will help you choose a game to play from your backlog</h3>
        <p>You wouldn't <i>not</i> play the game we tell you to play on the website you chose to be on, would you?</p>
      </section>

      <section id="input">
        <input
          type="text"
          placeholder="Enter game name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />

        <button
          type="button"
          className="fetch"
          onClick={async () => {console.log("printed"); await search(); console.log("printed")}}>
          Press for Game
        </button>
        {games.map((game, i) => (
          <div key={i}>
            <h2>{game.game_name}</h2>
            <p>Main Story: {game.main_story}h</p>
            <p>Main + Extra: {game.main_extra}h</p>
            <p>Completionist: {game.completionist}h</p>
          </div>
        ))}
      </section>
      
    </>
  )
}

export default App
