const fs = require('fs')
//const SpotifyWebApi = require('spotify-web-api-node');
//const token = "BQAbPRJ36XtqVrbZM-4v39AtIaTTkPBBOjFapxYiZ2aCAtbeKdApZ4Fng37uz5cGSQc9ttm-vyY5A3nUnuOxa8a7fkMELggHr4EqnHeBYGffM9m08HDwst1aG4n7sKluqUAw8q47s6BxNhyroLggF3tijbsl8Rmei4w4o3v5-cgMrVwGypWI0L9zrDS0N6PrD3qlMny_j2rsyvQ94weYTWSj82bXCp__hvJmDJoPlIwZSrzCMm6JT6AUgX2C8egN0jDsMnFEkSu5uHE3_hYY7FTEZLyVlUXHHWVXpi7bcd5aF99SyRtg";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    getUserPlaylists(me.body.id);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.id+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();