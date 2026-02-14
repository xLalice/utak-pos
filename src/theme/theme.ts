'use client';

import { createTheme } from '@mui/material/styles';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const theme = createTheme({
    typography: {
        fontFamily: outfit.style.fontFamily,
        h6: {
            fontWeight: 700,
            letterSpacing: '0.5px',
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '8px',
        },
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFD700', // Gold
            contrastText: '#121212',
        },
        secondary: {
            main: '#64748B', // Slate
        },
        background: {
            default: '#0F172A', // Deep Navy/Charcoal
            paper: '#1E293B',   // Lighter Navy
        },
        text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
        },
    },
    shape: {
        borderRadius: 16,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                }
            }
        }
    },
});

export default theme;
