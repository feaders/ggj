const express = require('express')
const app = express();
const port = 3049

app.use(express.static('public'));

app.get('/', (req, res) => {

    res.send('public/index.html');
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});