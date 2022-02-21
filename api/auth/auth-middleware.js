const User = require('../users/users-model')

function restricted(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        next({
            status: 401,
            message: 'You shall not pass!'
        })
    }
}

async function checkUsernameFree(req, res, next) {
    const { username } = req.body
        try {
            const [user] = await User.findBy({ username })
                if (user) {
                    next({
                        status: 422,
                        message: 'Username taken'
                    })
                } else {
                    next()
                }
        } catch (err) {
            next(err)
        }
}

async function checkUsernameExists(req, res, next) {
    const { username } = req.body
        try {
            const [user] = await User.findBy({ username })
                if (!user) {
                    next({
                        status: 401,
                        message: 'Invalid credentials'
                    })
                } else {
                    next()
                }
        } catch (err) {
            next(err)
        }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength(req, res, next) {
    const { password } = req.body
        if (!password || password.length < 3) {
            next({
                status: 422,
                message: 'Password must be longer than 3 chars'
            })
        } else {
            next()
        }
}

module.exports = {
    restricted,
    checkUsernameFree,
    checkUsernameExists,
    checkPasswordLength
}