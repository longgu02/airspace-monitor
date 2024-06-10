import { Box, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const getTime = (date: Date) => {
	return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export default function AircraftDetail(props: {
	info: any;
	setShowPopup: (arg: boolean) => void;
	setPopupInfo: (arg: any) => void;
}) {
	const { info, setShowPopup, setPopupInfo } = props;
	return (
		<>
			<Paper
				sx={{
					position: "absolute",
					// top: "5%",
					// left: "5%",
					zIndex: "999999",
					height: "100vh",
					// overflowY: "scroll",
					padding: 2,
					backgroundColor: "#192734",
					color: "white",
				}}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "end",
						"&:hover": { cursor: "pointer" },
					}}
					onClick={() => {
						setShowPopup(false), setPopupInfo(null);
					}}
				>
					<IconButton sx={{ color: "white" }}>
						<CloseIcon />
					</IconButton>
				</Box>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "1em",
						padding: "1em",
						borderRadius: "8px",
						boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
					}}
				>
					<div
						style={{
							fontWeight: "bold",
							fontSize: "1.2em",
							borderBottom: "1px solid #ddd",
							paddingBottom: "0.5em",
						}}
					>
						Aircraft Information
					</div>
					{/* <Typography>Flight: {popupInfo.flight}</Typography> */}
					<Typography>ICAO24: {info.icao24}</Typography>
					<Typography>Registration: {info.callsign}</Typography>
					<Typography>Country: {info.origin_country}</Typography>
					<div
						style={{
							fontWeight: "bold",
							fontSize: "1.2em",
							borderBottom: "1px solid #ddd",
							paddingBottom: "0.5em",
						}}
					>
						Flight Information
					</div>
					<Typography>
						Last contact: {getTime(new Date(Number(info.last_contact + "000")))}
					</Typography>
					<Typography>
						Time position:{" "}
						{getTime(new Date(Number(info.time_position + "000")))}
					</Typography>
					<Typography>
						Coordinate: {info.longitude}, {info.latitude}
					</Typography>
					<Typography>
						Currently on ground: {info.on_ground ? "Yes" : "No"}
					</Typography>
					<div
						style={{
							fontWeight: "bold",
							fontSize: "1.2em",
							borderBottom: "1px solid #ddd",
							paddingBottom: "0.5em",
							marginTop: "1em",
						}}
					>
						Altitude Information
					</div>
					<Typography>Barometric: {info.baro_altitude}</Typography>
					<Typography>Geometric: {info.geo_altitude}</Typography>
					<Typography>Velocity: {info.velocity}</Typography>
					{/* <div
							style={{
								fontWeight: "bold",
								fontSize: "1.2em",
								borderBottom: "1px solid #ddd",
								paddingBottom: "0.5em",
								marginTop: "1em",
							}}
						>
							Altitude Information
						</div>
						<Typography>
							Barometric altitude: {popupInfo.alt_baro} ft
						</Typography>
						<Typography>Geometric altitude: {popupInfo.alt_geom} ft</Typography>

						<div
							style={{
								fontWeight: "bold",
								fontSize: "1.2em",
								borderBottom: "1px solid #ddd",
								paddingBottom: "0.5em",
								marginTop: "1em",
							}}
						>
							Speed Information
						</div>
						<Typography>Ground speed: {popupInfo.gs} knots</Typography>
						<Typography>Indicated airspeed: {popupInfo.ias} knots</Typography>
						<Typography>True airspeed: {popupInfo.tas} knots</Typography>
						<Typography>Mach number: {popupInfo.mach}</Typography> */}
				</div>
				{/* <Typography>Flight: {popupInfo.flight}</Typography>
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
					</Typography> */}
			</Paper>
		</>
	);
}
