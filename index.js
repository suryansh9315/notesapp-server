const express = require('express')
const connectMongo = require('./db')

connectMongo()
const app = express()
const port = 3000

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api/auth',require("./Routes/auth"))
app.use('/api/notes',require("./Routes/notes"))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})