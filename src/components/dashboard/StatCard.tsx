
import React from 'react';
import { Paper, Typography, Box, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface StatCardProps {
    title: string;
    value: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    color?: string;
}

export default function StatCard({ title, value, icon: Icon, color = '#FFD700' }: StatCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px -4px ${color}33`,
                    borderColor: `${color}66`
                }
            }}
        >
            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, mb: 0.5, fontWeight: 600 }}>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ color: 'text.primary' }}>
                    {value}
                </Typography>
            </Box>

            <Box sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: `${color}22`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: color
            }}>
                <Icon sx={{ fontSize: 30 }} />
            </Box>

            <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                bgcolor: color,
                opacity: 0.05,
                pointerEvents: 'none'
            }} />
        </Paper>
    );
}
