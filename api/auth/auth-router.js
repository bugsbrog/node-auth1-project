const router = require('express').Router()
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware')
const bcrypt = require('bcryptjs')
const Auth = require('../users/users-model')

router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
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
  const { password } = req.body
    try {
      // const [user] = await Auth.findBy({ username })
      // Don't need this because it's in the mw
      if (bcrypt.compareSync(password, req.user.password)) {
        req.session.user = req.user
        res.json({ message: `Welcome ${req.user.username}!`})
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

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        next() // guess this works too instead of res.json
      } else {
        next({
          message: 'logged out'
        })
      }
    })
  } else {
    next({
      message: 'no session'
    })
  }
})

module.exports = router