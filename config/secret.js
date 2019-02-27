module.exports = {
    database: 'mongodb://jihad:jihad1234@ds115353.mlab.com:15353/e-commerce_db',
    port: process.env.PORT || 3000,
    secretKey: 'Jihad@Dev!', 

    facebook: {
        clientID: process.env.FACEBOOK_ID || '1162498273923633',
        clientSecret: process.env.FACEBOOK_SECRET || '691a2ccd91a0ccdf05049d9d368683c9',
        profileFields: ['emails', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback'
    }

}