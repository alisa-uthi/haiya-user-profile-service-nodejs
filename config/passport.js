const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const passport = require('passport')
const passportJWT = require("passport-jwt")
const JWTStrategy = passportJWT.Strategy
const ExtractJWT  = passportJWT.ExtractJwt

const userService = require('../services/user_service')
const drugAllergyService = require('../services/drug_allergy_service')
const congenitalDiseaseService = require('../services/congenital_service')

passport.use(
    new LocalStrategy({ 
        usernameField: 'email', 
        passwordField: 'password' 
    }, 
    async (email, password, done) => {
        try {
        // Match User
        const result = await userService.getUserByEmail(email)
        if(!result){
            // done(error, user, [options])
            return done(null, false, { 
            message: 'That user is not registered' 
            })
        }

        // Match password
        bcrypt.compare(password, result.Psn_Password, async (err, isMatched) => {
            if(err) throw err
            if(isMatched){
                const user = await userService.getUserById(result.ID)
                const drugAllergy = await drugAllergyService.getDrugAlleryByUserId(result.ID)
                const congenitalDisease = await congenitalDiseaseService.getCongenitalDisByUserId(result.ID)
                
                user.Psn_DrugAllergy = drugAllergy
                user.Psn_CongenitalDisease = congenitalDisease
                
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

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
        try {
            return done(null, jwtPayload.userId);
        } catch (error) {
            return done(error, false);
        }
    }
))