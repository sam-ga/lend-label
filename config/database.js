import mongoose from 'mongoose'

(async function (){
  try {
    await mongoose.connect(process.env.DB_URI)
    const db = mongoose.connection
    console.log(`Connected to ${db.name} on port ${db.port} 🚀`)
  } catch (err) {
    console.log(err)
  }
})()