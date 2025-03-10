import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={inter.className}
				style={{
					backgroundColor: "#192734",
					color: "white",
					padding: 0,
					margin: 0,
					overflowY: "hidden",
					overflowX: "hidden",
				}}
			>
				{children}
			</body>
		</html>
	);
}
