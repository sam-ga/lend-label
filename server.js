// Express
import express from 'express'
const app = express()

// Import router
import router from './config/router.js'

// Import .env variables
import 'dotenv/config.js'

// import DB connect function
import connect from './config/database.js'

// Start Express server
(async function(){
  try {
    // Connect to DB
    await connect()

    // Parser
    app.use(express.json())

    // Log requests
    app.use((req, res, next) => {
      console.log(`🚨 Request received: ${req.method} ${req.url}`)
      next()
    })

    // Routes
    app.use('/api', router)
    
    // 404
    app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

    // Listen
    app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`))
  } catch (err) {
    console.log(err)
  }
})()