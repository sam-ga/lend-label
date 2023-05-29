import mongoose from 'mongoose'

// * CLIENT SCHEMA
const clientSchema = new mongoose.Schema({
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
  stripeId: { type: String }
})

// * VALIDATION / MIDDLEWARE

// * Transaction history field
clientSchema.virtual('transactionHistory', {
  ref: 'Transaction', // this refers to the model we will query to populate our virtual field with data
  localField: '_id', // localField is the field on the local document that needs be matched with records on the queried model
  foreignField: 'client' // this is the field that will be checked against the localField, returning all records that match
})

export default clientSchema