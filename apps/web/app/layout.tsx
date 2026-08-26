import './globals.css';

export const metadata = {
  title: 'PlayMatch',
  description: 'Live competitive gaming and venue challenges',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}