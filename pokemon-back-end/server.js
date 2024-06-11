// server.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors'); // Import cors
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

// Endpoint to fetch Pokémon data with pagination
app.get('/api/pokemon', async (req, res) => {
    const limit = parseInt(req.query.limit) || 22;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const results = await Promise.all(response.data.results.map(async (pokemon) => {
            const pokemonDetails = await axios.get(pokemon.url);
            return pokemonDetails.data;
        }));
        res.json(results);
    } catch (error) {
        res.status(500).send('Server Error');
    }
});
app.use(cors());
app.use(express.json());

app.post('/run-python-script', (req, res) => {
    // Extract arguments from the request body
    const arg = req.body.text;
    console.log(arg);

    // Spawn a child process to run the Python script
    const pythonProcess = spawn('python3', ['./text-to-speech.py', arg]);

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        res.send(`Python script executed with code ${code}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
