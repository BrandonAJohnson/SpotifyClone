const express = require('express');
const SpotifyApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');
const config = require('./config.json');
const cors = require('cors');

//https://github.com/thelinmichael/spotify-web-api-node

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/refresh', (req, res) => {
	const refreshToken = req.body.refreshToken;
	const spotifyApi = new SpotifyApi({
		redirectUri: config.appUrl,
		clientId: config.clientId,
		clientSecret: config.clientSecret,
		refreshToken,
	});

	spotifyApi.refreshAccessToken().then((data) => {
		res.json({
			accessToken: data.body.access_token,
			expiresIn: data.body.expires_in,
		})
		console.log(data);

		spotifyApi.setAccessToken(data.body.access_token);
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400);
	});
});

app.post('/login', (req, res) => {
	const code = req.body.code;
	const spotifyApi = new SpotifyApi({
		redirectUri: config.appUrl,
		clientId: config.clientId,
		clientSecret: config.clientSecret,
	});

	spotifyApi.authorizationCodeGrant(code).then(data => {
		res.json({
			accessToken: data.body.access_token,
			refreshToken: data.body.refresh_token,
			expiresIn: data.body.expires_in,
		});
	}).catch((err) => {
		console.log(err);
		res.sendStatus(400);
	});
});

app.get('/lyrics', async (req, res) => {
	const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found!";
	res.json({lyrics});
});

app.listen(3001);