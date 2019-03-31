
const clientID = '20ef46cf22e74d23b2222d6e48438c25';
//const redirectURI = 'http://localhost:3000/';
const redirectURI = 'http://jammming.surge.sh';

const spotifySearchAPI = 'https://api.spotify.com/v1/search';
const spotifyPlaylistAPI = 'https://api.spotify.com/v1/users/${userId}/playlists';

let accessToken;
let expiresIn;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        let url = window.location.href;
        accessToken = this.extract(url, "access_token=", "&");
        if (accessToken) {
            expiresIn = this.extract(url, "expires_in=", "&");
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location.href = 'https://accounts.spotify.com/authorize?client_id=' + clientID + '&response_type=token&scope=playlist-modify-private&redirect_uri=' + redirectURI;
        }
    },
    search(term) {
        return fetch('https://api.spotify.com/v1/search?type=track&q=' + term, {
                        headers: this.buildHeader()})
                        .then(response => response.json())
                        .then(jsonResponse => {
                            if (jsonResponse.tracks) {
                                return jsonResponse.tracks.items.map(track => {
                                    return {
                                        id: track.id,
                                        name: track.name,
                                        artist: track.artists[0].name,
                                        album: track.album.name,
                                        uri: track.uri
                                    };
                                })
                            } else {
                                return [];
                            }
                    })
    },
    savePlaylist(name, tracks) {
        if (Boolean(name) & Boolean(tracks)) {
            return fetch('https://api.spotify.com/v1/me',
                {headers: this.buildHeader()})
                .then(response => response.json())
                .then(jsonResponse => {
                    let userId = jsonResponse.id;
                    return fetch('https://api.spotify.com/v1/users/' + userId + '/playlists',
                        {headers: this.buildHeader(),
                         method: 'POST',
                         body: JSON.stringify({name: name, public: false})})
                        .then(response => response.json())
                        .then(jsonResponse => {
                            console.log('Created playlist.');
                            let playlistId = jsonResponse.id;
                            return fetch('https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks',
                                {headers: this.buildHeader(),
                                 method: 'POST',
                                 body: JSON.stringify(tracks)})
                                 .then(response => response.json())
                                 .then(jsonResponse => {
                                     console.log('Saved tracks to playlist.')
                                     return jsonResponse.snapshot_id;
                                 })
                        })
                })
        } else {
            return;
        }
    },
    buildHeader() {
        let token = this.getAccessToken();
        return {Authorization: 'Bearer ' + token};
    },
    extract(string, keyword, limiter) {
        let startIndex = string.indexOf(keyword);
        if (startIndex !== -1) {
            // add the length of the keyword to the start position to get the "real" start
            startIndex += keyword.length;
            let endIndex = string.indexOf(limiter, startIndex);
            if (endIndex !== -1) {
                return string.slice(startIndex, endIndex);
            } else {
                return string.slice(startIndex);
            }
        }
        return undefined;
}
};

export default Spotify;
