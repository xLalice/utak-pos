'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Storefront } from '@mui/icons-material';

export default function Header() {
    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
            <Toolbar>
                <Storefront sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Utak Vibe-POS
                </Typography>
                <Box sx={{
                    bgcolor: 'secondary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 4,
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: 2
                }}>
                    Vibecoded using Gemini 2.0 Pro
                </Box>
            </Toolbar>
        </AppBar>
    );
}
