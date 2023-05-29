import express from 'express'
const router = express.Router()

// Controllers
import { login, register } from '../controllers/users.js'


// Users
router.route('/register')
  .post(register)

router.route('/login')
  .post(login)

export default router