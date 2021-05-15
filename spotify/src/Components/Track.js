export default function Track({track, chooseTrack}) {
	function handlePlay() {
		chooseTrack(track);
	}

	return (
		<div className="d-flex m-2 align-items-center">
			<img src={track.albumUrl} style={{height: "64px", width: "64px"}} alt={track.name} onClick={handlePlay}/>
			<div className="mx-3">
				<div className="fw-bold">{track.title}</div>
				<div className="fw-light">{track.artist.name}</div>
			</div>
		</div>
	);
}