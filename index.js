const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())

// Import plant routes
const plantRoutes = require('./routes/plantRoutes')

app.get('/', (req, res) => {
    res.send('🌱 Plant Care 🌱')
})

// Use the plantRoutes for the /plants path
app.use('/plants', plantRoutes)


// Error-handling middleware
app.use((err, req, res, next) => {
    // If the error does not have a statusCode, default it to 500 (Internal Server Error)
    err.statusCode = err.statusCode || 500

    // If the error does not have a specific 'status', default it to 'error'
    err.status = err.status || 'error'
  
    // Send the error response to the client
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message
    })
});    

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
