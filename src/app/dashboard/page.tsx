
"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, CircularProgress } from '@mui/material';
import { AttachMoney, Receipt, ShoppingBag } from '@mui/icons-material';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import { formatCurrency } from '@/utils/taxEngine';

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, txRes] = await Promise.all([
                    fetch('/api/analytics'),
                    fetch('/api/transactions')
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (txRes.ok) setTransactions(await txRes.json());
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Poll every 30 seconds for specific "Real-time" feel
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom>
                    Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time sales performance for today.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        title="Total Revenue"
                        value={stats ? formatCurrency(stats.totalSales) : '₱0.00'}
                        icon={AttachMoney}
                        color="#10B981" // Emerald
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        title="Transactions"
                        value={stats ? stats.transactionCount.toString() : '0'}
                        icon={Receipt}
                        color="#3B82F6" // Blue
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <StatCard
                        title="Avg. Order Value"
                        value={stats ? formatCurrency(stats.averageOrderValue) : '₱0.00'}
                        icon={ShoppingBag}
                        color="#F59E0B" // Amber
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <RecentTransactions transactions={transactions} />
                </Grid>
            </Grid>
        </Container>
    );
}
