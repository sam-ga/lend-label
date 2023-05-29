import User from '../models/users.js'
import jwt from 'jsonwebtoken'
import { Unauthorised, sendError } from '../lib/errors.js'

// * REGISTER ROUTE
export const register = async (req, res) => {
  try {
    console.log(req.body)
    const newUser = await User.create(req.body)
    return res.json({ message: `Welcome ${newUser.username}`})
  } catch (err) {
    return sendError(res, err)
  }
}

// * LOGIN ROUTE
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const userToLogin = await User.findOne({ email: email })

    // Check the plain text password matches the hashed password stored in our database
    const userIsValidated = await userToLogin.validatePassword(password)

    // Check to see if a user was found by the email provided
    if(!userToLogin || !userIsValidated){
      throw new Unauthorised()
    }
    
    // Create JWT
    const token = jwt.sign({ sub: userToLogin._id }, process.env.SECRET, { expiresIn: '7d' })
    
    // Send response
    return res.json({ message: `Welcome back, ${userToLogin.username}`, token: token })
  } catch (err) {
    console.log(err)
    return sendError(res, err)
  }
}