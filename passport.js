const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const {users} = require("./models");
function initializePassport(passport) {
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    },
        async function(email, password, done) {
            let user = false;
            try {
                user = await users.findOne({where: {email}});
            } catch (e) {
                if (e) {
                    return done(e);
                }
            }
    
            if (!user) {
                return done(null, false);
            }
            checkPass = await bcrypt.compare(password, user.password);
            if (!checkPass) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }
    ));
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
    
    passport.deserializeUser(async (id, done) => {
        const user = await users.findOne({where: {id:id}});
        done(null,user);
    });
    
}


module.exports = initializePassport;