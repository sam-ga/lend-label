// NotFound Error
// This error is going to be thrown when the requested resource is not found
export class NotFound extends Error {
  constructor(message){
    super(message)
    this.name = 'NotFound'
    this.status = 404
  }
}

export class Unauthorised extends Error {
  constructor(message){
    super(message)
    this.name = 'Unauthorised'
    this.message = message ? message : 'Unauthorised'
    this.status = 401
  }
}

export const sendErrors = (res, err) => {
  console.log(err)
  console.log('ERR MESSAGE', err.message)
  console.log('ERR NAME', err.name)
  console.log('ERR STATUS', err.status)
  if (err instanceof NotFound || err instanceof Unauthorised){
    return res.status(err.status).json({ message: err.message })
  } else if (err instanceof CastError){
    return res.status(400).json({ message: err.message })
  } else if (err.name === 'ValidationError'){
    return res.status(422).json({ message: err.errors ? err.errors : err.message })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: err.message })
  } else {
    return res.status(500).json({ message: err.message })
  }
}