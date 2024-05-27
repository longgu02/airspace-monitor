"use client";
import Image from "next/image";
import styles from "./page.module.css";
import ReactMapGL, { Map, Marker } from "react-map-gl";
import { useRef, useState } from "react";
// import mapboxgl from "!mapbox-gl";
import AlbumIcon from "@mui/icons-material/Album";

const MapPage = () => {
	const [viewport, setViewport] = useState({
		latitude: 45.4211,
		longitude: -75.6903,
		width: "100vw",
		height: "100vh",
		zoom: 10,
	});

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng, setLng] = useState(-70.9);
	const [lat, setLat] = useState(42.35);
	const [zoom, setZoom] = useState(9);

	// return (
	// 	<div>
	// 		<ReactMapGL
	// 			{...viewport}
	// 			mapboxAccessToken="pk.eyJ1IjoicGxvbmcxMjExMjAwMiIsImEiOiJjbHdnanI0bzEwNWpvMmlxY3R0ZWtqNHJ6In0.PA-ujtlqlgQmAP5FzDZ8Vg"
	// 			// onViewportChange={(viewport) => {
	// 			// 	setViewport(viewport);
	// 			// }}
	// 		></ReactMapGL>
	// 	</div>
	// );

	return (
		<Map
			mapLib={import("mapbox-gl")}
			initialViewState={viewport}
			style={{ width: "100vw", height: "100vh" }}
			mapStyle="mapbox://styles/plong12112002/clwixbocw00ho01pc7jut6zao"
			mapboxAccessToken="pk.eyJ1IjoicGxvbmcxMjExMjAwMiIsImEiOiJjbHdnanI0bzEwNWpvMmlxY3R0ZWtqNHJ6In0.PA-ujtlqlgQmAP5FzDZ8Vg"
		>
			<Marker latitude={21.01} longitude={105.8}>
				{/* <div>Dit con me may aaaaaaaaaaaaaaa</div> */}
				<AlbumIcon sx={{ color: "yellow" }} />
			</Marker>
		</Map>
	);
};

export default MapPage;
