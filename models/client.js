import mongoose from 'mongoose'

// * REVIEW SCHEMA
const reviewSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'Label', required: true},
  content: { type: String, required: true, maxlength: 500 },
  rating: { type: Number, min: 1, max: 5, required: true }
}, {
  timestamps: true
})

// * CLIENT SCHEMA
const clientSchema = new mongoose.Schema({
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
  organisation: { type: String },
  website: { type: String, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/gm },
  socials: {
    instagram: { type: String, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/gm },
    tikTok: { type: String, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/gm }
  },
  bio: { type: String, maxlength: 300 },
  type: { type: String, required: true },
  following: [{ type: mongoose.Schema.ObjectId, ref: 'Label' }],
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'Item' }],
  stripeId: { type: String },
  reviews: [reviewSchema]
})

// * VALIDATION / MIDDLEWARE
clientSchema.virtual('rating')
  .get(function(){
    if (!this.reviews.length) return '0.0'
    // Create a sum, then average it by dividing by the length
    const sum = this.reviews.reduce((acc, review) => {
      return acc + review.rating
    }, 0)
    return parseFloat((sum / this.reviews.length).toFixed(2))
  })

// Transaction history
clientSchema.virtual('transactionHistory', {
  ref: 'Transaction', // this refers to the model we will query to populate our virtual field with data
  localField: '_id', // localField is the field on the local document that needs be matched with records on the queried model
  foreignField: 'client' // this is the field that will be checked against the localField, returning all records that match
})

// * EXPORT MODEL
export default mongoose.model('Client', clientSchema)