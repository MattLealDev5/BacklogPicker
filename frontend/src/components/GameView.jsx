
function GameView({game}) {
    // const [game, setGame] = useState({
    //     appid: 0,
    //     name: "",
    //     genres: [],
    //     header_image: "",
    // })
    
    return (
        <div>
          <a href={`https://store.steampowered.com/app/${game.appid}`} target="_blank" rel="noreferrer">
            <img
              src={game.header_image}
              alt="new"
            />
          </a>
          <h2>{game.name}</h2>
          {game.genres?.map(genre => (
            <li key={genre.id}> {genre.description} </li>
          ))}
          {/* <p>Main Story: {game.main_story}h</p>
          <p>Main + Extra: {game.main_extra}h</p>
          <p>Completionist: {game.completionist}h</p> */}
        </div>
    )
}

export default GameView