// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware')
const bcrypt = require('bcryptjs')
const Auth = require('../users/users-model')
const {findBy} = require("../users/users-model");

router.post('/register', checkUsernameFree, async (req, res, next) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    const user = { username, password: hash }
    const createUser = await Auth.add(user)
    res.json(createUser)
  } catch (err) {
      next(err)
  }
})

router.post('/login', checkUsernameExists, checkPasswordLength, async (req, res, next) => {
  const { username, password } = req.body
    try {
      const [user] = await findBy({ username })
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user
        res.json({ message: `Welcome ${user.username}!`})
      } else {
        next({
          status: 401,
          message: 'Invalid credentials'
        })
      }
    } catch (err) {
      next(err)
    }
})
/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.get('/logout', async (req, res, next) => {

})
/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

module.exports = router