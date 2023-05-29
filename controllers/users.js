
// POST /register
export const register = async (req, res) => {
  try {
    console.log('HIT REGISTER ROUTE')
  } catch (err) {
    console.log(err)
    sendErrors(res, err)
  }
}

// POST /login
export const login = async (req, res) => {
  try {
    console.log('HIT LOGIN ROUTE')
  } catch (err) {
    console.log(err)
    sendErrors(res, err)
  }
}