module.exports = {
  database: "mongodb://jihad:abc1234@ds245647.mlab.com:45647/e-commerce_db_v12",
  port: process.env.PORT || 3000,
  secretKey: "Jihad@Dev!",

  facebook: {
    clientID: process.env.FACEBOOK_ID || "1162498273923633",
    clientSecret:
      process.env.FACEBOOK_SECRET || "691a2ccd91a0ccdf05049d9d368683c9",
    profileFields: ["emails", "displayName"],
    callbackURL: "https://ecle-com.herokuapp.com/auth/facebook/callback"
  },
  google: {
    clientID: "",
    clientSecret: ""
  }
  // facebook2: {
  //   clientID: process.env.FACEBOOK_ID || "368535967347432",
  //   clientSecret:
  //     process.env.FB_CLIENT_SECRET || "e22125452100066845451f273b7f07b4"
  // }
};
//mongodb://jihad:abc1234@ds343985.mlab.com:43985/e-commerce_db_v1
//https://ecle-com.herokuapp.com/auth/facebook/callback
//http://localhost:3000/auth/facebook/callback
