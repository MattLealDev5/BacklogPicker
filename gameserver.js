
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { PythonShell } from 'python-shell';

const app = express()

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:5173'];

app.use(cors({ origin: allowedOrigins }));
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Backlog Picker',
      version: '1.0.0'
    },
    tags: [
      { name: 'Testing', description: 'For testing not to actually use' },
      { name: 'Steam', description: 'Steam Related Endpoints' },
      { name: 'HLTB', description: 'howlongtobeat Related Endpoints' }
    ],
  },
  apis: ['gameserver.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

import { HowLongToBeatService, HowLongToBeatEntry } from 'howlongtobeat';
let hltbService = new HowLongToBeatService();

/**
 * @swagger
 * /hltb:
 *   get:
 *     tags: [HLTB]
 *     summary: Return howlongtobeat info for a specified game.
 *     description: yeah.
 *     parameters:
 *       - name: gameName
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: cool
 *       404:
 *         description: not cool
 */
app.get('/hltb', async function (req, res) {
    try {
        let options = {
            mode: 'json',
            pythonPath: process.env.NODE_ENV === 'production' ? 'python3' : 'python/venv/bin/python',
            pythonOptions: ['-u'],
            scriptPath: 'python/',
            args: [req.query.gameName, req.query.limit]
        };
        const output = await PythonShell.run('hltb.py', options);
        return res.status(200).json(output);
    } catch(error) {
        return res.status(404).json({ message: error.message, stack: error.stack });
    }
});

/**
 * @swagger
 * /steam:
 *   get:
 *     tags: [Steam]
 *     summary: Returns a game from Steam API.
 *     description: Gets your library and picks out a game.
 *     parameters:
 *       - name: userID
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: genre
 *         in: query
 *         schema:
 *           type: string
 *       - name: length
 *         in: query
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: cool
 *       404:
 *         description: not cool
 */
app.get('/steam', async function (req, res) {
    try {
        const steamID = req.query.userID
        const genre = req.query.genre
        const length = req.query.length
        const steamApiKey = process.env.STEAM_API_KEY;

        // Get games from user and sort by playtime, then pick from that
        const ownedRes = await fetch(`https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamApiKey}&steamid=${steamID}&format=json&include_appinfo=1`)
        const ownedData = await ownedRes.json()
        var games = ownedData.response.games

        // Filters out thoroughly played games and sorts from least to most played
        // Source - https://stackoverflow.com/a/2722213
        games = games.filter(function (g) {
            return g.playtime_forever <= 0;
        });
        games.sort(function(a, b) {
            return parseFloat(a.playtime_forever) - parseFloat(b.playtime_forever);
        });


        // Gets info from each game to make a final decision
        var chosenGame;
        for(var i = 0; i < games.length; i++) {
            const gameRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${games[i].appid}`)
            const gameData = await gameRes.json()
            const game = gameData[games[i].appid].data
            const gameGenres = game.genres

            console.log(game.name)
            var genreCheck = false;
            var lengthCheck = false;

            // Checking genres for match
            for(var j = 0; j < gameGenres.length; j++) {
                if (genre == null) { genreCheck = true; }
                else {
                    if(gameGenres[j].description === genre) {
                        genreCheck = true;
                        break;
                    }
                }
            }

            // Checking length for agreeable completion time
            if (length == null) { lengthCheck = true; }
            else {
                let options = {
                    mode: 'json',
                    pythonPath: process.env.NODE_ENV === 'production' ? 'python3' : 'python/venv/bin/python',
                    pythonOptions: ['-u'],
                    scriptPath: 'python/',
                    args: [game.name]
                };
                const output = await PythonShell.run('hltb.py', options);
                const gameLength = output[0].main_story
                console.log(gameLength)
                if(gameLength <= length) {
                    lengthCheck = true;
                }
            }

            console.log(`Genre Match:  ${genreCheck}`)
            console.log(`Length Check: ${lengthCheck}`)
            console.log(``)

            if (genreCheck && lengthCheck) {
                chosenGame = gameData;
                break;
            }
        }

        return res.status(200).json(chosenGame);
    } catch(error) {
        return res.status(404).json({ message: error.message, stack: error.stack });
    }
});

// Setup server
app.listen(process.env.PORT || 5678); //start the server
// app.use(cors({ origin: 'https://your-frontend.onrender.com' }));
console.log('Server is running...');
console.log('Webapp:   http://localhost:5678/')
console.log('API Docs: http://localhost:5678/api-docs')