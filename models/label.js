import mongoose from 'mongoose'

const labelSchema = new mongoose.Schema({
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
  labelName: { type: String, required: true },
  bio: { type: String, maxlength: 300 },
  website: { type: String, required: true, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/gm },
  socials: {
    instagram: { type: String, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/gm },
    tikTok: { type: String, match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/gm }
  },
  clients: [{ type: mongoose.Schema.ObjectId, ref: 'Client' }],
  blocked: [{ type: mongoose.Schema.ObjectId, ref: 'Client' }]
})

// Validation etc.

// All previoius transactions
labelSchema.virtual('transactionHistory', {
  ref: 'Transaction', // this refers to the model we will query to populate our virtual field with data
  localField: '_id', // localField is the field on the local document that needs be matched with records on the queried model
  foreignField: 'label' // this is the field that will be checked against the localField, returning all records that match
})

// Inventory of items
labelSchema.virtual('inventory', {
  ref: 'Item', // this refers to the model we will query to populate our virtual field with data
  localField: '_id', // localField is the field on the local document that needs be matched with records on the queried model
  foreignField: 'label' // this is the field that will be checked against the localField, returning all records that match
})


export default mongoose.model('Label', labelSchema)