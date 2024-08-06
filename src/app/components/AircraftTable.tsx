import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

interface Column {
	id: "icao24" | "callsign" | "country";
	label: string;
	minWidth?: number;
	align?: "right";
	format?: (value: number) => string;
}

const columns: readonly Column[] = [
	{ id: "icao24", label: "Icao24", minWidth: 70 },
	{ id: "callsign", label: "Registration", minWidth: 70 },
	{ id: "country", label: "Origin Country", minWidth: 200 },
	// {
	// 	id: "population",
	// 	label: "Population",
	// 	minWidth: 170,
	// 	align: "right",
	// 	format: (value: number) => value.toLocaleString("en-US"),
	// },
	// {
	// 	id: "size",
	// 	label: "Size\u00a0(km\u00b2)",
	// 	minWidth: 170,
	// 	align: "right",
	// 	format: (value: number) => value.toLocaleString("en-US"),
	// },
	// {
	// 	id: "density",
	// 	label: "Density",
	// 	minWidth: 170,
	// 	align: "right",
	// 	format: (value: number) => value.toFixed(2),
	// },
];

interface Data {
	icao24: string;
	callsign: string;
	country: string;
}

function createData(icao24: string, callsign: string, country: string): Data {
	return { icao24, callsign: callsign || "- - - - - -", country };
}

export default function AircraftTable(props: { data: FlightData[] }) {
	const { data } = props;
	const rows = [
		...data.map((it) => createData(it.icao24, it.callsign, it.origin_country)),
	];
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper sx={{ width: "100%", overflow: "hidden" }}>
			<TableContainer sx={{ maxHeight: "90vh" }}>
				<Table
					stickyHeader
					aria-label="sticky table"
					style={{ backgroundColor: "#192734" }}
				>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{
										minWidth: column.minWidth,
										color: "white",
										backgroundColor: "#192734",
									}}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow
										hover
										role="checkbox"
										tabIndex={-1}
										key={row.icao24}
										sx={{
											"&:hover": {
												backgroundColor: "#2d2d30",
												cursor: "pointer",
											},
										}}
									>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell
													key={column.id}
													align={column.align}
													style={{ color: "white" }}
												>
													{column.format && typeof value === "number"
														? column.format(value)
														: value}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				sx={{ backgroundColor: "#192734", color: "white" }}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}
