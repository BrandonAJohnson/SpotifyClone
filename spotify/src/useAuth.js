import {useState, useEffect} from 'react';
import axios from 'axios';
import config from './config.json';

export default function useAuth(code) {
	const [accessToken, setAccessToken] = useState();
	const [refreshToken, setRefreshToken] = useState();
	const [expiresIn, setExpiresIn] = useState();

	// set access state after a code is acquired from login
	useEffect(() => {
		axios.post(`${config.serverUrl}/login`, {
			code,
		}).then(res => {
			setAccessToken(res.data.accessToken);
			setRefreshToken(res.data.refreshToken);
			setExpiresIn(res.data.expiresIn);
			console.log(res.data);
			window.history.pushState({}, null, "/");
		}).catch(() => {
			window.location = '/';
		});
	}, [code]);

	// refresh authorization after expiration
	useEffect(() => {
		if (!refreshToken || !expiresIn) return;
		//set a refresh 1 minute before session expires
		const interval = setInterval(() => {
			axios.post(`${config.serverUrl}/refresh`, {
				refreshToken,
			}).then(res => {
				setAccessToken(res.data.accessToken);
				setExpiresIn(res.data.expiresIn);
				window.history.pushState({}, null, "/");
			}).catch(() => {
				window.location = '/';
			});
		}, (expiresIn-60)*1000);

		return () => clearInterval(interval);
	}, [refreshToken, expiresIn]);

	return accessToken;
}
