import { Box, IconButton, Paper, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const getTime = (date: Date) => {
	return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export default function AircraftDetail(props: {
	info: any;
	isDateSelected: boolean;
	setShowPopup: (arg: boolean) => void;
	setPopupInfo: (arg: any) => void;
}) {
	const { info, isDateSelected, setShowPopup, setPopupInfo } = props;
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
						Time position:{" "}
						{getTime(new Date(Number(info.time_position + "000")))}
					</Typography>
					{!isDateSelected && (
						<>
							<Typography>
								Coordinate: {info.longitude}, {info.latitude}
							</Typography>
							<Typography>
								Last contact:{" "}
								{getTime(new Date(Number(info.last_contact + "000")))}
							</Typography>

							<Typography>
								Currently on ground: {info.on_ground ? "Yes" : "No"}
							</Typography>
						</>
					)}
					{!isDateSelected && (
						<>
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
						</>
					)}
				</div>
			</Paper>
		</>
	);
}
