const {findBy} = require("../users/users-model");

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
            const [user] = await findBy({ username })
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

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
    try {

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
function checkPasswordLength() {

}

module.exports = {
    restricted,
    checkUsernameFree,
    checkUsernameExists,
    checkPasswordLength
}