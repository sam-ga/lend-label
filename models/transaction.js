import mongoose from 'mongoose'

export default mongoose.model('Transaction', new mongoose.Schema({
  label: { type: mongoose.Schema.ObjectId, required: true, ref: 'Label' },
  client: { type: mongoose.Schema.ObjectId, required: true, ref: 'Client' },
  items: [{ type: mongoose.Schema.ObjectId, required: true, ref: 'Item' }],
  status: {
    returned: { type: Boolean },
    lastUpdated: { type: Date, required: true }
  },
  transactionId: { type: String, required: true }
}, {
  timestamps: true
}))