const connectToMongo = require("./db");
const express = require('express')
const cors = require('cors');
const { fetchNews } = require('./fetchNews');
const fixIncompleteArticles = require("./utils/fixIncompleteArticles");


connectToMongo();
// fetchNews({ type: 'fetch' });

fixIncompleteArticles();


const app = express()
const port = 5000


// CORS Middleware :-
app.use(cors());

// Middleware to use req.body :-
app.use(express.json());


// Available routes :-

app.use('/api/auth/', require('./routes/auth'))
app.use('/api/article', require('./routes/article'))


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})


// setInterval(() => {
//   fetchNews({ type: 'fetch' });
// }, 60 * 60 * 1000);
