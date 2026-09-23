import "./globals.css";

export const metadata = {
  title: "Interactive Portfolio Demo",
  description: "3D room + cinematic interactions + scroll storytelling demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
