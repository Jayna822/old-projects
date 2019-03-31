import React, { Component } from 'react';
import './App.css';
import { SearchBar } from './Components/SearchBar/SearchBar';
import { SearchResults } from './Components/SearchResults/SearchResults';
import { Playlist } from './Components/Playlist/Playlist';
import Spotify from './util/Spotify';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: 'New Playlist',
            playlistTracks: []
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.searchSpotify = this.searchSpotify.bind(this);
    }
    addTrack(track) {
		if (this.state.playlistTracks.every(plTrack => plTrack.id !== track.id)) {
			let newPlaylistTracks = this.state.playlistTracks.concat(track);
			this.setState({playlistTracks: newPlaylistTracks});
		}
	}
    removeTrack(track) {
        let newPlaylistTracks = this.state.playlistTracks.filter(plTrack =>
			plTrack.id !== track.id);
		this.setState({playlistTracks: newPlaylistTracks});
    }
    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }
    savePlaylist() {
        const trackURIs = this.state.playlistTracks.map(track => {
            return track.uri;
        });
        console.log(trackURIs);
        Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
            this.setState({playlistName: 'New Playlist', playlistTracks:[]});
        });
    }
    searchSpotify(searchTerm) {
        Spotify.search(searchTerm).then(
            tracks => this.setState({searchResults: tracks})
        );
    }
    render() {
        return (
            <div>
              <h1>Ja<span className="highlight">mmm</span>ing</h1>
              <div className="App">
                <SearchBar onSearch={this.searchSpotify}/>
                <div className="App-playlist">
                  <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
                  <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
                </div>
              </div>
            </div>
        );
    }
}

export default App;
