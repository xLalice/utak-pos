
"use client";

import Link from 'next/link';
import { AppBar, Toolbar, Typography, Box, IconButton, useTheme, Button } from '@mui/material';
import { Storefront, Menu as MenuIcon, Notifications, AccountCircle, Dashboard } from '@mui/icons-material';

export default function Header() {
    const theme = useTheme();

    return (
        <AppBar position="sticky" elevation={0} sx={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        mr: 2,
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)'
                    }}>
                        <Storefront sx={{ color: 'primary.contrastText' }} />
                    </Box>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 800, background: 'linear-gradient(45deg, #FFD700, #FDB931)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        UTAK VIBE
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mr: 4 }}>
                    <Button component={Link} href="/" color="inherit" startIcon={<Storefront />} sx={{ opacity: 0.7, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.05)' } }}>
                        POS
                    </Button>
                    <Button component={Link} href="/dashboard" color="inherit" startIcon={<Dashboard />} sx={{ opacity: 0.7, '&:hover': { opacity: 1, bgcolor: 'rgba(255,255,255,0.05)' } }}>
                        Dashboard
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        px: 2,
                        py: 0.5,
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: { xs: 'none', md: 'block' }
                    }}>
                        Vibecoded with Google Antigravity and Gemini 3
                    </Box>
                    <IconButton color="inherit">
                        <Notifications />
                    </IconButton>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
