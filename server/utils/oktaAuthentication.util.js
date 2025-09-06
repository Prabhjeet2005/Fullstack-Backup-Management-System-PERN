const { auth } = require("express-openid-connect");

const config = {
	authRequired: false,
	auth0Logout: true,
	secret: process.env.OKTA_SECRET,
	baseURL: process.env.OKTA_BASEURL,
	clientID: process.env.OKTA_CLIENTID,
	issuerBaseURL: process.env.OKTA_ISSUER_BASEURL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/", (req, res) => {
	res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});
