const connectToMongo = require("./db");
const express = require('express')

connectToMongo();

const app = express()
const port = 5000


// Middleware to use req.body :-
app.use(express.json());


// Available routes :-

app.use('/api/auth/', require('./routes/auth'))
app.use('/api/article', require('./routes/article'))


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
