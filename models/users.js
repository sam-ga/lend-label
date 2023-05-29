import mongoose from 'mongoose'
import { generate } from 'randomstring'
import bcrypt from 'bcrypt'

// Schemas
import clientSchema from './schemas/client.js'
import labelSchema from './schemas/label.js'

// * REVIEW SCHEMA
const reviewSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  content: { type: String, required: true, maxlength: 500 },
  rating: { type: Number, min: 1, max: 5, required: true }
}, {
  timestamps: true
})

// * USER SCHEMA
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, validate: {
    validator: function(value) {
      // Regular expression pattern for email validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    },
    message: 'Invalid email address',
  }},
  password: { type: String, required: true, validate: {
    validator: function(value) {
      // Regular expression pattern for password validation
      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
      return passwordRegex.test(value);
    },
    message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.',
  }},
  isLabel: { type: Boolean, required: true },
  apiKey: { type: String, unique: true },
  profile: {
    type: mongoose.Schema.Types.Mixed,
    default: function () {
      return this.isLabel ? labelSchema : clientSchema
    },
  },
  reviews: [reviewSchema]
})

// * Rating field
userSchema.virtual('rating')
  .get(function(){
    if (!this.reviews.length) return '0.0'
    // Create a sum, then average it by dividing by the length
    const sum = this.reviews.reduce((acc, review) => {
      return acc + review.rating
    }, 0)
    return parseFloat((sum / this.reviews.length).toFixed(2))
  })

  userSchema.pre('save', function (next) {
  // * Create API key on register
  if (!this.apiKey) {
    // Generate a random string using the 'randomstring' library
    this.apiKey = generate(10) // Change the length as per your requirement
  }
  // * If password modified, hash it
  if(this.isModified('password')){
    // genSaltSync takes a number of rounds and generates us a salt (a random string of characters) which will be added to the plain text password in the next step to form our hash
    const salt = bcrypt.genSaltSync(12)
    // Taking the plain text password and the salt we created, the hash is created, which we assign to the password field to be saved to the database in the next step
    this.password = bcrypt.hashSync(this.password, salt)
  }
  next()
})

// * Remove the password whenever a document is converted back into JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, json){
    delete json.password
  }
})

// * Validate user
userSchema.methods.validatePassword = function(plainTextPassword){
  return bcrypt.compare(plainTextPassword, this.password)
}

// * EXPORT MODEL
export default mongoose.model('User', userSchema)