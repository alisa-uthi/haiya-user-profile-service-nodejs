const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const userService = require('../services/user_service')

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        // Match User
        // const user = await userService.
        if(!user){
          // done(error, user, [options])
          return done(null, false, { 
            message: 'That username is not registered' 
          })
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatched) => {
          if(err) throw err
          if(isMatched){
            return done(null, user)
          } else {
            return done(null, false, {
              message: 'Password is incorrect'
            })
          }
        })
      } catch(err) {
        console.log(err)
      }
    })
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user)
    } catch(err) {
      console.log(err)
    }
  })
}