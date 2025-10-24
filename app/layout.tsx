import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paths - Voronoi & Delaunay Visualization",
  description: "Interactive visualization of Voronoi diagrams and Delaunay triangulations as mathematical duals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
