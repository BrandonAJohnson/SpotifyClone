import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import logo from '../images/Spotify_Logo_RGB_Green.png';
import config from '../config.json';

console.log(config);

// https://developer.spotify.com/documentation/general/guides/authorization-guide/
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${config.clientId}&response_type=code&redirect_uri=${config.appUrl}&scope=streaming%20user-read-email%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

const imageAttributes = {
	minHeight: "100vh",
	maxWidth: "800px"
};

export default function Login() {
	return <>
		<Container className="justify-content-md-center align-items-center p-5 my-5" style={{imageAttributes}}>
			<Row>
				<Col>
					<Image src={logo} fluid/>
				</Col>
			</Row>
			<Row className="my-5">
				<Col className="d-flex justify-content-center">
					<a className="btn btn-success btn-lg" href={AUTH_URL} style={{margin: "auto"}}>Login With Spotify</a>
				</Col>
			</Row>
		</Container>
	</>;
}

