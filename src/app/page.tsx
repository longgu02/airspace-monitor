"use client";
import Image from "next/image";
import styles from "./page.module.css";
import ReactMapGL, { Layer, Map, Marker, Popup, Source } from "react-map-gl";
import { useEffect, useRef, useState } from "react";
// import mapboxgl from "!mapbox-gl";
import AlbumIcon from "@mui/icons-material/Album";
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControlLabel,
	Grid,
	Paper,
	Radio,
	Stack,
	TextField,
	Typography,
	RadioGroup,
	IconButton,
	Collapse,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import DoneIcon from "@mui/icons-material/Done";
import { client } from "./services/client";
import "mapbox-gl/dist/mapbox-gl.css";
import AircraftDetail from "./components/AircraftDetail";
import {
	DatePicker,
	DateTimePicker,
	LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import CloseIcon from "@mui/icons-material/Close";
import AircraftTable from "./components/AircraftTable";

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
	const [openChangeAirspace, setOpenChangeAirspace] = useState(false);
	const [openAddNewAirspace, setOpenAddNewAirspace] = useState(false);
	const [openSelectDate, setOpenSelectDate] = useState(false);
	const [airspaces, setAirspaces] = useState();
	const [currentlySelectedAirspace, setCurrentlySelectedAirspace] =
		useState(false);
	const [fromDate, setFromDate] = useState(dayjs(new Date()));
	const [toDate, setToDate] = useState(dayjs(new Date()));
	const [isDateSelected, setDateSelected] = useState(false);

	const [newAirspaceName, setNewAirspaceName] = useState("");
	const [newAirspaceCSV, setNewAirspaceCSV] = useState("");

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

	useEffect(() => {
		client
			.get("/api/v1/airspace")
			.then((res) => {
				setAirspaces(res);
				setCurrentlySelectedAirspace(res[0]);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	// );

	useEffect(() => {
		// client
		// 	.get("/api/v1/airspace/66582fb114e0939831ffb5b6")
		// 	.then((res) => {
		// 		setCurrentlySelectedAirspace(res);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
		// ?from=${fromDate.valueOf()}&to=${toDate.valueOf()}
		console.log("hello");
		if (isDateSelected) {
			console.log("hello2");
		} else {
			const source = new EventSource(
				`http://localhost:6969/api/v1/adsb/sse/${currentlySelectedAirspace._id}`
			);

			source.addEventListener("open", () => {
				console.log("SSE opened!");
			});

			source.addEventListener("message", (e) => {
				console.log(e.data);
				const data = JSON.parse(e.data);

				setData(data);
				if (popupInfo && popupInfo.icao24) {
					const currentlyPopup = data.find(
						(it) => it.icao24 == popupInfo.icao24
					);
					let coordinates = popupInfo.coordinates;
					coordinates.push([currentlyPopup.longitude, currentlyPopup.latitude]);
					const fin = { ...currentlyPopup, coordinates: coordinates };
					console.log("fin", fin);
					console.log(currentlyPopup);
					setPopupInfo(fin);
				}
			});

			source.addEventListener("error", (e) => {
				console.error("Error: ", e);
			});

			return () => {
				source.close();
			};
		}
	}, [currentlySelectedAirspace, popupInfo, isDateSelected, fromDate, toDate]);

	console.log("date", isDateSelected);

	// const test = {
	// 	type: "Feature",
	// 	geometry: {
	// 		type: "LineString",
	// 		coordinates: [
	// 			[105.804817, 21.028511],
	// 			[25.028511, 110.804817],
	// 		],
	// 	},
	// };
	console.log(currentlySelectedAirspace);
	const test = {
		type: "Feature",
		geometry: {
			type: "Polygon",
			coordinates: [
				[
					[currentlySelectedAirspace.lonMin, currentlySelectedAirspace.latMin],
					[currentlySelectedAirspace.lonMin, currentlySelectedAirspace.latMax],
					[currentlySelectedAirspace.lonMax, currentlySelectedAirspace.latMax],
					[currentlySelectedAirspace.lonMax, currentlySelectedAirspace.latMin],
					[currentlySelectedAirspace.lonMin, currentlySelectedAirspace.latMin],
				],
			],
		},
	};

	const route = {
		type: "Feature",
		geometry: {
			type: "LineString",
			coordinates: popupInfo?.coordinates,
			// coordinates: [
			// 	[125.9462, 37.4607],
			// 	[125.905, 37.4528],
			// ],
		},
	};

	console.log("rao", route);

	console.log(data);

	const handleAddAirspace = () => {
		const csv = newAirspaceCSV.split(",");
		console.log(csv);
		console.log({
			latMin: Number(csv[0]),
			lonMin: Number(csv[1]),
			latMax: Number(csv[2]),
			lonMax: Number(csv[3]),
		});
		client
			.post("/api/v1/airspace", {
				name: newAirspaceName,
				latMin: Number(csv[1]),
				lonMin: Number(csv[0]),
				latMax: Number(csv[3]),
				lonMax: Number(csv[2]),
			})
			.then((res) => {
				console.log(res);
				setAirspaces([...airspaces, res]);
			})
			.catch((err) => console.log(err));
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Box>
				{showPopup && popupInfo && (
					<AircraftDetail
						info={popupInfo}
						isDateSelected={isDateSelected}
						setShowPopup={setShowPopup}
						setPopupInfo={setPopupInfo}
					/>
				)}
				<Box
					sx={{
						position: "absolute",
						zIndex: 2,
						top: "3%",
						right: "28%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
						alignItems: "right",
					}}
				>
					<Box
						sx={{
							display: "flex", // Added this
							justifyContent: "flex-end", // Added this
							// flexDirection: "row-reverse",

							// width: "100",
						}}
					>
						{isDateSelected && (
							<Typography
								sx={{
									margin: "auto 0 auto 0",
									backgroundColor: "#192734",
									padding: 1,
									borderRadius: 2,
								}}
							>
								{getTimeString(fromDate)} - {getTimeString(toDate)}
							</Typography>
						)}
						<IconButton
							// onClick={() => {
							// 	if (openSelectDate) {
							// 		client
							// 			.get(
							// 				`/api/v1/record?from=${fromDate.valueOf()}&to=${toDate.valueOf()}`
							// 			)
							// 			.then((res) => {
							// 				setData(res);
							// 				console.log(res);
							// 			})
							// 			.catch((err) => {
							// 				console.log(err);
							// 			});
							// 		setDateSelected(true);
							// 	}
							// 	setOpenSelectDate(!openSelectDate);
							// }}
							sx={{ backgroundColor: "#192734" }}
						>
							{openSelectDate ? (
								<DoneIcon
									sx={{ color: "white" }}
									onClick={() => {
										if (openSelectDate) {
											client
												.get(
													`/api/v1/record?from=${fromDate.valueOf()}&to=${toDate.valueOf()}&airspace=${
														currentlySelectedAirspace?._id
													}`
												)
												.then((res) => {
													setData(res);
													setDateSelected(true);
													setOpenSelectDate(!openSelectDate);
													console.log(res);
												})
												.catch((err) => {
													console.log(err);
												});
										}
									}}
								/>
							) : isDateSelected ? (
								<CloseIcon
									sx={{ color: "white" }}
									onClick={() => {
										setDateSelected(false);
										setOpenSelectDate(false);
										setData(null);
									}}
								/>
							) : (
								<CalendarMonthIcon
									sx={{ color: "white" }}
									onClick={() => {
										setOpenSelectDate(true);
									}}
								/>
							)}
						</IconButton>
					</Box>
					<Box>
						<Collapse in={openSelectDate}>
							<Paper
								sx={{
									zIndex: 2,
									paddingTop: 2,
									paddingBottom: 1,
									paddingLeft: 2,
									paddingRight: 2,
								}}
							>
								{" "}
								<DateTimePicker
									sx={{ color: "red", zIndex: 10 }}
									label="From"
									value={fromDate}
									onChange={(newValue) => setFromDate(newValue)}
								/>
								<DateTimePicker
									label="To"
									value={toDate}
									onChange={(newValue) => setToDate(newValue)}
								/>
							</Paper>
						</Collapse>
					</Box>
				</Box>
				<Grid container>
					<Grid item xs={9}>
						<Map
							mapLib={import("mapbox-gl")}
							initialViewState={viewport}
							style={{ width: "100%", height: "100vh" }}
							mapStyle="mapbox://styles/plong12112002/clwixbocw00ho01pc7jut6zao"
							mapboxAccessToken="pk.eyJ1IjoicGxvbmcxMjExMjAwMiIsImEiOiJjbHdnanI0bzEwNWpvMmlxY3R0ZWtqNHJ6In0.PA-ujtlqlgQmAP5FzDZ8Vg"
						>
							{data?.length > 0 &&
								data.map((it: FlightData, index) => (
									<>
										<Marker
											latitude={
												isDateSelected
													? it?.coordinates?.length > 0 &&
													  it.coordinates[it.coordinates.length - 1][1]
													: it.latitude
											}
											longitude={
												isDateSelected
													? it.coordinates[it.coordinates.length - 1][0]
													: it.longitude
											}
											key={index}
											// anchor="bottom"
											rotation={isDateSelected ? it.lastHeading : it.true_track}
											onClick={(e) => {
												// e.preventDefault();
												console.log(e);
												setShowPopup(true);
												client
													.get(
														`/api/v1/adsb/route/aircraft/${it.icao24}/${it.time_position}`
													)
													.then((res) => {
														if (res) {
															if (res.coordinates.length > 0) {
																it.coordinates = res.coordinates;
															} else {
																it.coordinates = [];
															}
															it.lastHeading = res.lastHeading;
															setPopupInfo(it);
														}
													})
													.catch((err) => {
														console.log(err);
														setPopupInfo(it);
													});
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
													color:
														it.icao24 != popupInfo?.icao24 ? "green" : "yellow",
													cursor: "pointer",
												}}
											/>
										</Marker>
									</>
								))}
							<Source type="geojson" data={test}>
								<Layer
									id="airspace"
									type="line"
									paint={{
										"fill-color": "white",
										"line-color": "white",
										"line-width": 4,
									}}
								/>
							</Source>

							{showPopup && data?.length > 0 && (
								<Source
									key={new Date()}
									type="geojson"
									data={{
										type: "Feature",
										geometry: {
											type: "LineString",
											coordinates: popupInfo?.coordinates,
											// coordinates: [
											// 	[125.9462, 37.4607],
											// 	[125.905, 37.4528],
											// ],
										},
									}}
								>
									{console.log("pop", popupInfo?.coordinates)}
									<Layer
										id="route"
										type="line"
										paint={{
											"line-color": "red",
											"line-width": 4,
											"line-translate-anchor": "viewport",
										}}
									/>
								</Source>
							)}
						</Map>
					</Grid>
					<Grid item xs={3} sx={{ backgroundColor: "#192734", paddingTop: 2 }}>
						<Box sx={{ height: "100vh" }}>
							<Typography variant="h5" sx={{ textAlign: "center" }}>
								Airspace Monitor
							</Typography>
							<Box sx={{ padding: 2 }}>
								<Stack spacing={2}>
									<Button
										variant="contained"
										fullWidth
										onClick={() => setOpenChangeAirspace(true)}
									>
										Change airspace
									</Button>
									<Button
										variant="contained"
										fullWidth
										onClick={() => setOpenAddNewAirspace(true)}
									>
										Add new airspace
									</Button>
								</Stack>
							</Box>
							<Divider />

							<Box
								sx={{
									padding: 2,
									margin: 0,
									position: "relative",
									overflowY: "scroll",
									height: "75vh",
								}}
							>
								<Typography>
									Date:{" "}
									{isDateSelected
										? `${getTimeString(fromDate)} - ${getTimeString(toDate)}`
										: "Real time"}
								</Typography>
								<Typography>Total: {data?.length || 0} aircraft(s)</Typography>
								{data?.length > 0 ? (
									data?.length > 0 && <AircraftTable data={data} />
								) : (
									// data.map((it, index) => (
									// 	<Box
									// 		key={index}
									// 		sx={{
									// 			display: "flex",
									// 			justifyContent: "space-between",
									// 			backgroundColor:
									// 				it.icao24 == popupInfo?.icao24
									// 					? "#1A1A1A"
									// 					: "transparent",
									// 			"&:hover": {
									// 				backgroundColor: "#2d2d30",
									// 				cursor: "pointer",
									// 			},
									// 		}}
									// 		onClick={() => {
									// 			if (showPopup) {
									// 				setPopupInfo(null);
									// 				setShowPopup(!showPopup);
									// 			} else {
									// 				setPopupInfo(it);
									// 				setShowPopup(!showPopup);
									// 			}
									// 		}}
									// 	>
									// 		<Typography>
									// 			{it.callsign ? it.callsign : "- - - - - -"}
									// 		</Typography>
									// 		<Typography>{it.icao24}</Typography>
									// 	</Box>
									// ))
									<CircularProgress
										sx={{ position: "absolute", top: "50%", left: "50%" }}
									/>
								)}
							</Box>
						</Box>
					</Grid>
				</Grid>
				<Dialog
					open={openChangeAirspace}
					// TransitionComponent={Transition}
					fullWidth
					maxWidth="xs"
					keepMounted
					onClose={() => setOpenChangeAirspace(false)}
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle>{"Choose Airspace"}</DialogTitle>
					<DialogContent>
						{airspaces && (
							<RadioGroup
								aria-labelledby="demo-error-radios"
								name="quiz"
								value={currentlySelectedAirspace?._id || airspaces[0]._id} // Set this to the _id of the default selected airspace
								onChange={(e) => {
									setCurrentlySelectedAirspace(
										airspaces.find(
											(airspace) => airspace._id === e.target.value
										)
									);
									setData([]);
								}}
							>
								{airspaces &&
									airspaces.map((airspace) => (
										<FormControlLabel
											value={airspace._id}
											key={airspace._id}
											control={<Radio />}
											label={airspace.name}
										/>
									))}
							</RadioGroup>
						)}

						{/* {airspaces &&
						airspaces.map((airspace) => (
							<Typography
								onClick={() => {
									setCurrentlySelectedAirspace(airspace);
									setData([]);
								}}
								key={airspace._id}
								sx={{ "&:hover": { cursor: "pointer" } }}
							>
								{airspace.name}
							</Typography>
						))} */}
						<DialogContentText id="alert-dialog-slide-description"></DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpenChangeAirspace(false)}>Close</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					open={openAddNewAirspace}
					// TransitionComponent={Transition}
					fullWidth
					maxWidth="lg"
					keepMounted
					onClose={() => setOpenAddNewAirspace(false)}
					aria-describedby="alert-dialog-slide-description"
				>
					<DialogTitle>Add new airspace</DialogTitle>
					<DialogContent>
						<Stack spacing={2} minWidth={150} sx={{ marginBottom: 2 }}>
							<TextField
								fullWidth
								label="Name"
								value={newAirspaceName}
								onChange={(e) => setNewAirspaceName(e.target.value)}
							/>
							<TextField
								fullWidth
								label="Boundaries (CSV Raw)"
								value={newAirspaceCSV}
								onChange={(e) => setNewAirspaceCSV(e.target.value)}
							/>
						</Stack>
						<iframe
							src="https://boundingbox.klokantech.com/"
							style={{ width: "100%", height: "70vh" }}
						></iframe>
						<DialogContentText id="alert-dialog-slide-description">
							{/* {airspaces &&
							airspaces.map((airspace) => (
								<Typography
									onClick={() => {
										setCurrentlySelectedAirspace(airspace);
										setData([]);
									}}
									key={airspace._id}
									sx={{ "&:hover": { cursor: "pointer" } }}
								>
									{airspace.name}
								</Typography>
							))} */}
							{/* Hehe */}
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setOpenAddNewAirspace(false)}>Close</Button>
						<Button onClick={handleAddAirspace}>Add</Button>
					</DialogActions>
				</Dialog>
			</Box>
		</LocalizationProvider>
	);
};

const getTimeString = (date: Dayjs) => {
	return `${date.hour()}:${date.minute()} ${date.date()}/${
		date.month() + 1
	}/${date.year()}`;
};

export default MapPage;
