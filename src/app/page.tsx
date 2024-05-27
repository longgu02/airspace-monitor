"use client";
import Image from "next/image";
import styles from "./page.module.css";
import ReactMapGL, { Map, Marker, Popup } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
// import mapboxgl from "!mapbox-gl";
import AlbumIcon from "@mui/icons-material/Album";
import {
	Box,
	Button,
	Divider,
	Grid,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import { client } from "./services/client";
import "mapbox-gl/dist/mapbox-gl.css";

const FAKE_DATA = [
	{ icao24: "88888e", country: "VNA" },
	{ icao24: "88888c", country: "VNA" },
	{ icao24: "88888a", country: "VNA" },
	{ icao24: "88888b", country: "THA" },
];

const MapPage = () => {
	const [viewport, setViewport] = useState({
		latitude: 21.028511,
		longitude: 105.804817,
		// width: "100vw",
		// height: "100vh",
		zoom: 10,
	});

	const [data, setData] = useState<Array<FlightData>>([]);
	const [showPopup, setShowPopup] = useState<boolean>(false);
	const [popupInfo, setPopupInfo] = useState<FlightData | null>(null);

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

	useEffect(() => {
		client
			.get("/api/v1/adsb/21.028511/105.804817/250")
			.then((res) => {
				setData(res);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	console.log(data);

	return (
		<Box>
			{showPopup && popupInfo && (
				<Paper
					sx={{
						position: "absolute",
						top: "5%",
						left: "5%",
						zIndex: "999999",
						height: "80vh",
						overflowY: "scroll",
						padding: 2,
						backgroundColor: "#192734",
						color: "white",
					}}
				>
					<Box onClick={() => setShowPopup(false)}>Tat</Box>
					<Typography>Flight: {popupInfo.flight}</Typography>
					<Typography>Hex: {popupInfo.hex}</Typography>
					<Typography>Registration: {popupInfo.r}</Typography>
					<Typography>Type: {popupInfo.t}</Typography>
					<Typography>Barometric altitude: {popupInfo.alt_baro} ft</Typography>
					<Typography>Geometric altitude: {popupInfo.alt_geom} ft</Typography>
					<Typography>Ground speed: {popupInfo.gs} knots</Typography>
					<Typography>Indicated airspeed: {popupInfo.ias} knots</Typography>
					<Typography>True airspeed: {popupInfo.tas} knots</Typography>
					<Typography>Mach number: {popupInfo.mach}</Typography>
					<Typography>Wind direction: {popupInfo.wd} degrees</Typography>
					<Typography>
						Outside air temperature: {popupInfo.ws} Celsius
					</Typography>
					<Typography>
						Total air temperature: {popupInfo.tat} Celsius
					</Typography>
					<Typography>
						Rate of change of the track angle: {popupInfo.track_rate} deg/s
					</Typography>
					<Typography>Roll angle: {popupInfo.roll} degrees</Typography>
					<Typography>
						Magnetic heading: {popupInfo.mag_heading} degrees
					</Typography>
					<Typography>
						True heading: {popupInfo.true_heading} degrees
					</Typography>
					<Typography>
						Rate of change of barometric altitude: {popupInfo.baro_rate} ft/min
					</Typography>
					<Typography>
						Rate of change of geometric altitude: {popupInfo.geom_rate} ft/min
					</Typography>
					<Typography>Squawk code: {popupInfo.squawk}</Typography>
					<Typography>Emergency status: {popupInfo.emergency}</Typography>
					<Typography>Aircraft category: {popupInfo.category}</Typography>
					<Typography>
						QNH used by navigation system: {popupInfo.nav_qnh} hPa
					</Typography>
					<Typography>
						Altitude set on Mode Control Panel: {popupInfo.nav_altitude_mcp} ft
					</Typography>
					<Typography>
						Altitude set on Flight Management System:{" "}
						{popupInfo.nav_altitude_fms} ft
					</Typography>
					<Typography>
						Heading set on navigation system: {popupInfo.nav_heading} degrees
					</Typography>
					<Typography>Latitude: {popupInfo.lat} degrees</Typography>
					<Typography>Longitude: {popupInfo.lon} degrees</Typography>
					<Typography>
						Navigation Integrity Category: {popupInfo.nic}
					</Typography>
					<Typography>Radius of Containment: {popupInfo.rc}</Typography>
					<Typography>
						Time since position last updated: {popupInfo.seen_pos} seconds
					</Typography>
					<Typography>
						ADS-B message format version: {popupInfo.version}
					</Typography>
					<Typography>
						Navigation Integrity Category for Barometric altitude:{" "}
						{popupInfo.nic_baro}
					</Typography>
					<Typography>
						Navigation Accuracy Category for Position: {popupInfo.nac_p}
					</Typography>
					<Typography>
						Navigation Accuracy Category for Velocity: {popupInfo.nac_v}
					</Typography>
					<Typography>Source Integrity Level: {popupInfo.sil}</Typography>
					<Typography>
						Type of Source Integrity Level: {popupInfo.sil_type}
					</Typography>
					<Typography>Geometric Vertical Accuracy: {popupInfo.gva}</Typography>
					<Typography>System Design Assurance: {popupInfo.sda}</Typography>
					<Typography>
						Alert condition: {popupInfo.alert ? "Yes" : "No"}
					</Typography>
					<Typography>
						Special Position Identification: {popupInfo.spi ? "Yes" : "No"}
					</Typography>
					<Typography>
						Total number of Mode S messages received: {popupInfo.messages}
					</Typography>
					<Typography>
						Time since a message was last received: {popupInfo.seen} seconds
					</Typography>
					<Typography>
						Received signal strength indicator: {popupInfo.rssi}
					</Typography>
					<Typography>
						Distance from receiver: {popupInfo.dst} nautical miles
					</Typography>
					<Typography>
						Direction from receiver: {popupInfo.dir} degrees
					</Typography>
				</Paper>
			)}

			<Grid container>
				<Grid item xs={9}>
					<Map
						mapLib={import("mapbox-gl")}
						initialViewState={viewport}
						style={{ width: "100%", height: "100vh" }}
						mapStyle="mapbox://styles/plong12112002/clwixbocw00ho01pc7jut6zao"
						mapboxAccessToken="pk.eyJ1IjoicGxvbmcxMjExMjAwMiIsImEiOiJjbHdnanI0bzEwNWpvMmlxY3R0ZWtqNHJ6In0.PA-ujtlqlgQmAP5FzDZ8Vg"
					>
						{data.length > 0 &&
							data.map((it: FlightData, index) => (
								<>
									<Marker
										latitude={it.lat}
										longitude={it.lon}
										key={index}
										anchor="bottom"
										rotation={it.true_heading}
										onClick={(e) => {
											// e.preventDefault();
											console.log(e);
											setShowPopup(true);
											setPopupInfo(it);
											// setViewport({
											// 	...viewport,
											// 	latitude: it.lat,
											// 	longitude: it.lon,
											// 	transitionDuration: 500, // Smooth transition to the new location
											// });
										}}
									>
										{/* <AlbumIcon sx={{ color: "yellow" }} /> */}
										{/* <img
										src="https://static.vecteezy.com/system/resources/previews/004/879/681/non_2x/icon-of-an-airplane-taking-off-free-vector.jpg"
										style={{
											width: "20px",
											height: "20px",
										}}
									/> */}
										<AirplanemodeActiveIcon
											sx={{
												color: it != popupInfo ? "green" : "yellow",
												cursor: "pointer",
											}}
										/>
									</Marker>
								</>
							))}
					</Map>
				</Grid>
				<Grid item xs={3} sx={{ backgroundColor: "#192734", paddingTop: 2 }}>
					<Typography variant="h5" sx={{ textAlign: "center" }}>
						Airspace Monitor
					</Typography>
					<Box sx={{ padding: 2 }}>
						<Stack spacing={2}>
							<Button variant="contained" fullWidth>
								Change airspace
							</Button>
							<Button variant="contained" fullWidth>
								Add new airspace
							</Button>
						</Stack>
					</Box>
					<Divider />
					<Box sx={{ padding: 2, margin: 0 }}>
						{data.length > 0 &&
							data.map((it, index) => (
								<Box
									key={index}
									sx={{
										display: "flex",
										justifyContent: "space-between",
										"&:hover": {
											backgroundColor: "#2d2d30",
											cursor: "pointer",
										},
									}}
								>
									<Typography>{it.flight}</Typography>
									<Typography>{it.hex}</Typography>
								</Box>
							))}
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default MapPage;
