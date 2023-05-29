// Express
import express from 'express'
const app = express()

// Import router
import router from './config/router.js'

// Import .env variables
import 'dotenv/config.js'

// Connect to mongodb
import './config/database.js'

// Start Express server
(async function(){
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
})()