var SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');
const express = require('express')
var access_token;
var refresh_token;
var expires_in;

const scopes = [
	'ugc-image-upload',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'streaming',
	'app-remote-control',
	'user-read-email',
	'user-read-private',
	'playlist-read-collaborative',
	'playlist-modify-public',
	'playlist-read-private',
	'playlist-modify-private',
	'user-library-modify',
	'user-library-read',
	'user-top-read',
	'user-read-playback-position',
	'user-read-recently-played',
	'user-follow-read',
	'user-follow-modify'
];

// credentials are optional
var spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	redirectUri: 'https://boiling-plains-88386.herokuapp.com/callback'
});

const app = express();
const PORT = process.env.PORT

app.get('/', (req, res) => {
	res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', (req, res) => {
	const error = req.query.error;
	const code = req.query.code;
	const state = req.query.state;

	if (error) {
		console.error('Callback Error:', error);
		res.send(`Callback Error: ${error}`);
		return;
	}

	spotifyApi.authorizationCodeGrant(code).then(data => {
		access_token = data.body['access_token'];
		refresh_token = data.body['refresh_token'];
		expires_in = data.body['expires_in'];

		spotifyApi.setAccessToken(access_token);
		spotifyApi.setRefreshToken(refresh_token);

		console.log('access_token:', access_token);
		console.log('refresh_token:', refresh_token);

		console.log(
			`Successfully retreived access token. Expires in ${expires_in} s.`
		);
		getMyData().then((value) => {
			console.log("\n ---Redirect to /albums.html---\n");
			app.use(express.static('public'));
			res.sendFile(process.cwd() + '/public/albums.html');
		});
		
		setInterval(async () => {
			const data = await spotifyApi.refreshAccessToken();
			const access_token = data.body['access_token'];


			console.log('The access token has been refreshed!');
			console.log('access_token:', access_token);
			spotifyApi.setAccessToken(access_token);
		}, expires_in / 2 * 1000);
	})
	.catch(error => {
		console.error('Error getting Tokens:', error);
		res.send(`Error getting Tokens: ${error}`);
	});
});

app.listen(PORT, () =>
	console.log(
		`HTTP Server up. Now go to http://localhost:${PORT}/login in your browser.`
	)
);

//GET MY PROFILE DATA
async function getMyData() {
	const me = await spotifyApi.getMe();
	const albums = await getMySavedAlbums();
}

async function getMySavedAlbums() {


	var data = [];
	var offset = -50;
	var page;
	while (true)
	{
		offset += 50;
		if (typeof page !== 'undefined' && page.body.items.length < 50)
			break;
		page = await spotifyApi.getMySavedAlbums({limit: 50, offset : offset});
		if (page.body.items.length > 0) 
			data = data.concat(page.body.items);
		else
			break ;
	}

	let outp = JSON.stringify(data);
	await fs.promises.writeFile('public/data.json', outp);
	console.log("\n---WRITTEN---\n");
}
