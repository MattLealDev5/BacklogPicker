import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  // Used by HLTB API
  const [gameName, setGameName] = useState('')
  const [game, setGame] = useState({
    game_name: "",
    main_story: "",
    main_extra: "",
    completionist: ""
  })

  // For Steam API
  const [userID, setUserID] = useState('')

  // UI
  const [isLoading, setLoading] = useState(false)

  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5678';

  async function getDataHLTB() {
      const res = await fetch(`${apiURL}/hltb?gameName=${gameName}&limit=1`)
      const data = await res.json()
      setGame(data[0])
      console.log(data)
  }

  async function getGameSteam() {
      const res = await fetch(`${apiURL}/steam?userID=${userID}`)
      const data = await res.json()
      setGame(data[0])
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
          placeholder="Enter Steam User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
        />

        <button
          type="button"
          className="fetch"
          onClick={
            async () => {
              setLoading(true)

              await getGameSteam()
              await getDataHLTB()

              setLoading(false)
            }}>
          Press for Game
        </button>
        {isLoading ? (
          <p>Fetching game</p>
        ) : (
          <div>
            <h2>{game.game_name}</h2>
            <p>Main Story: {game.main_story}h</p>
            <p>Main + Extra: {game.main_extra}h</p>
            <p>Completionist: {game.completionist}h</p>
          </div>
        )}
      </section>
      
    </>
  )
}

export default App
