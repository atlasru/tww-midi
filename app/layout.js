import "../styles/globals.css";

export const metadata = {
  title: "MIDI Library",
  description: "Apple-like MIDI gallery"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}