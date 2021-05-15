import { useState, useEffect } from 'react';
import useAuth from '../useAuth';
import { Container, Form } from 'react-bootstrap';
import SpotifyApi from 'spotify-web-api-node';
import config from '../config.json';
import Track from './Track';
import Player from './Player';
import axios from 'axios';

const spotifyApi = new SpotifyApi({
	clientId: config.clientId,
});

export default function Dashboard({code}) {
	const accessToken = useAuth(code);
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [currentTrack, setCurrentTrack] = useState();
	const [lyrics, setLyrics] = useState();

	let chooseTrack = (track) => {
		setCurrentTrack(track);
		setSearch('');
		setLyrics('');
	};

	useEffect(() => {
		if (!currentTrack) return;

		axios.get(`${config.serverUrl}/lyrics`, {
			params: {
				track: currentTrack.title,
				artist: currentTrack.artist,
			}
		}).then(res => {
			setLyrics(res.data.lyrics);
		})
	}, [currentTrack]);

	useEffect(() => {
		if (!accessToken) return;
		spotifyApi.setAccessToken(accessToken);
	}, [accessToken]);

	useEffect(() => {
		if (!search) return setSearchResults([]);
		if (!accessToken) return;

		let cancel = false;
		spotifyApi.searchTracks(search).then((data) => {
			if (cancel) return;
			setSearchResults(
				data.body.tracks.items.map((track) => {
					const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
						if (image.height < smallest.height) return image;
						return smallest;
					}, track.album.images[0]);

					return {
						artist: track.artists[0],
						title: track.name,
						uri: track.uri,
						albumUrl: smallestAlbumImage.url,
					}
				})
			);
		});

		return () => cancel = true;
	}, [search, accessToken]);

	return <>
		<Container className="d-flex flex-column py-2" style={{height: "100vh"}}>
			<Form.Control type="search" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}/>
			<div className="flex-grow-1 my-2" style={{overflowY: "auto"}}>
				{searchResults && searchResults.map((track,i) => {
					return <Track track={track} chooseTrack={chooseTrack} key={i}/>;
				})}
				{searchResults.length === 0 && lyrics &&
					<div className="text-center" style={{whiteSpace: "pre"}}>{lyrics}</div>
				}
			</div>
			<div><Player accessToken={accessToken} trackUri={currentTrack?.uri}/></div>
		</Container>
	</>;
}

