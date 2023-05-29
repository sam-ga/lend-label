import mongoose from 'mongoose'

const labelSchema = new mongoose.Schema({
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

export default labelSchema