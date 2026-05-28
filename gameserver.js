
import express from 'express';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { PythonShell } from 'python-shell';

const app = express()

if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}
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
 *     summary: Check if can get howlongtobeat game info.
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
            pythonPath: 'python/venv/bin/python',
            pythonOptions: ['-u'],
            scriptPath: 'python/',
            args: [req.query.gameName, req.query.limit]
        };
        const output = await PythonShell.run('hltb.py', options);
        return res.status(200).json(output);
    } catch(error) {
        return res.status(404).json(error);
    }
});

// Setup server
app.listen(5678); //start the server
// app.use(cors({ origin: 'https://your-frontend.onrender.com' }));
console.log('Server is running...');
console.log('Webapp:   http://localhost:5678/')
console.log('API Docs: http://localhost:5678/api-docs')