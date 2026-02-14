import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Box, ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from "@/theme/theme";

export const metadata: Metadata = {
  title: "Utak Vibe-POS",
  description: "Premium Point of Sale System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              bgcolor: 'background.default',
              color: 'text.primary'
            }}>
              <Header />
              <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'hidden' }}>
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
