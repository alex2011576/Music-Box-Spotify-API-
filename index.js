var SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs')
const express = require('express')
var access_token;
var refresh_token;
var expires_in;
// This file is copied from: https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js

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
    clientId: '729a9ed5a5ab47ac803bd4eca21d3413',
    clientSecret: '49c3a4a9e23046469d691d51474d7103',
    redirectUri: 'http://localhost:8888/callback'
  });
  
  const app = express();
  
  app.get('/login', (req, res) => {
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
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.send('Success! You can now close the window.');
        getMyData();

        
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
  
  app.listen(8888, () =>
    console.log(
      'HTTP Server up. Now go to http://localhost:8888/login in your browser.'
    )
  );

  //GET MY PROFILE DATA
function getMyData() {
    (async () => {
      const me = await spotifyApi.getMe();
      // console.log(me.body);
      getMySavedAlbums(me.body.id);
      //getUserPlaylists(me.body.id);
    })().catch(e => {
      console.error(e);
    });
  }

  
  async function getMySavedAlbums(userName) {
    const data = await spotifyApi.getMySavedAlbums(userName)
    console.log("---------------+++++++++++++++++++++++++")


    //console.log(JSON.stringify(data.body.items));
    for (let album of data.body.items) {
        console.log(JSON.stringify(album.album.name));
        album.album.artists.map(artists => {
            console.log(artists.name);
            }
        );
        console.log("----\n");
      //let tracks = await getAlbumTracks(album.id, album.name);
    //   console.log(tracks);
     // const tracksJSON = { tracks }
      //let data = JSON.stringify(tracksJSON);
      //fs.writeFileSync(album.id+'.json', data);
    }
}
// //   GET MY Albums
//   async function getUserPlaylists(userName) {
//     const data = await spotifyApi.getUserPlaylists(userName)
  
//     console.log("---------------+++++++++++++++++++++++++")
//     let playlists = []
  
//     for (let playlist of data.body.items) {
//       console.log(playlist.name + " " + playlist.id)
      
//       let tracks = await getPlaylistTracks(playlist.id, playlist.name);
//     //   console.log(tracks);
  
//       const tracksJSON = { tracks }
//       let data = JSON.stringify(tracksJSON);
//       fs.writeFileSync(playlist.id+'.json', data);
//     }
//   }
  
// //   GET SONGS FROM PLAYLIST
//   async function getPlaylistTracks(playlistId, playlistName) {
  
//     const data = await spotifyApi.getPlaylistTracks(playlistId, {
//       offset: 1,
//       limit: 100,
//       fields: 'items'
//     })
  
//     // console.log('The playlist contains these tracks', data.body);
//     // console.log('The playlist contains these tracks: ', data.body.items[0].track);
//     // console.log("'" + playlistName + "'" + ' contains these tracks:');
//     let tracks = [];
  
//     for (let track_obj of data.body.items) {
//       const track = track_obj.track
//       tracks.push(track);
//       console.log(track.name + " : " + track.artists[0].name)
//     }
    
//     console.log("---------------+++++++++++++++++++++++++")
//     return tracks;
//   }
