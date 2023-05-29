import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag' }],
  value: { type: Number, required: true },
  label: { type: mongoose.Schema.ObjectId, ref: 'Label' }
})

itemSchema.virtual('likes', {
  ref: 'Client', // this refers to the model we will query to populate our virtual field with data
  localField: '_id', // localField is the field on the local document that needs be matched with records on the queried model
  foreignField: 'likes' // this is the field that will be checked against the localField, returning all records that match
})

export default mongoose.model('Item', itemSchema)