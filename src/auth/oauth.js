const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const AuthorModel = require('../authors/schema')
const { authenticate } = require('../authTools')

passport.use(
    "google",
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: "http://localhost:6969/authors/googleRedirect"
        },
        async (request, accessToken, refreshToken, profile, next) => {
            const newAuthor = {
                googleId: profile.id,
                name: profile.name.givenName,
                email: profile.emails[0].value,
                role: "Author",
                refreshTokens: [],
            }
            try {
                const author = await AuthorModel.findOne({ globalId: profile.id })

                if (author) {
                    const tokens = await authenticate(author)
                    console.log(tokens)
                    next(null, { author: createdAuthor, tokens })
                }
            } catch (error) {
                next(error)
            }
        }
    )
)

passport.serializeUser(function (author, next) {
    next(null, author)
})