
import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import PythonShell from 'python-shell';

const app = express()
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Game Recommender',
      version: '1.0.0'
    },
    tags: [
      { name: 'Testing', description: 'For testing not to actually use' },
      { name: 'Steam', description: 'Steam Related Endpoints' },
      { name: 'howlongtobeat', description: 'howlongtobeat Related Endpoints' }
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
 * /test/hltb:
 *   get:
 *     tags: [Testing]
 *     summary: Check if can get howlongtobeat game info.
 *     description: yeah.
 *     responses:
 *       200:
 *         description: cool
 *       404:
 *         description: not cool
 */
app.get('/test/hltb', async function (req, res) {
    try {
        const game = await hltbService.search('Nioh');
        return res.status(200).json(game);
    } catch(error) {
        return res.status(404).json(error);
    }
});

// Setup server
app.listen(5678); //start the server
console.log('Server is running...');
console.log('Webapp:   http://localhost:5678/')
console.log('API Docs: http://localhost:5678/api-docs')