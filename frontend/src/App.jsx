import { useState } from 'react'
import heroImg from './assets/hero.png'
import './App.css'
import GameView from './components/GameView'

function App() {
  const [game, setGame] = useState({
      appid: 0,
      name: "",
      genres: [],
      header_image: "",
  })

  // For Steam API
  const [userID, setUserID] = useState('')
  const [genre, setGenre] = useState('')
  const [length, setLength] = useState('')

  // UI
  const [isLoading, setLoading] = useState(false)
  const [hasContent, setContent] = useState(false)
  const [getError, setError] = useState(false)

  const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5678';

  async function getGameSteam() {
      var url = `${apiURL}/steam?userID=${userID}`
      if (genre != "") { url += `&genre=${genre}` }
      if (length != "") { url += `&length=${length}` }
      console.log(url)

      const res = await fetch(url)
      const data = await res.json()
      console.log(data)
      return data
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
        <br/>

        <p>Pick a Genre</p>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Don't Care</option>
          <option value="Action">Action</option>
          <option value="Strategy">Strategy</option>
          <option value="RPG">RPG</option>
          <option value="Casual">Casual</option>
          <option value="Racing">Racing</option>
          <option value="Sports">Sports</option>
          <option value="Indie">Indie</option>
          <option value="Adventure">Adventure</option>
          <option value="Simulation">Simulation</option>
          <option value="Massively Multiplayer">Massively Multiplayer</option>
        </select>
        <br/>

        <p>Select maximum length</p>
        <select value={length} onChange={(e) => setLength(e.target.value)}>
          <option value="">Don't Care</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <br/>


        <button
          type="button"
          className="fetch"
          onClick={
            async () => {
              setLoading(true)
              setContent(false)
              setError(false)

              const game = await getGameSteam()
              if (game && game.name) {
                  setGame(game)
                  setContent(true)
                  console.log(game)
              } else {
                  setError(true)
                  console.error("Failed to fetch game:", data?.message)
              }

              setLoading(false)
            }}>
          Press for Game
        </button>
        {isLoading ? (
          <p>Fetching game</p>
        ) : getError ? (
          <p>Error fetching content, sorry</p>
        ) : hasContent ? (
          <GameView game={game}/>
        ) : null}
      </section>
      
    </>
  )
}

export default App
