
import React from 'react';
import {
    Paper,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import { formatCurrency } from '@/utils/taxEngine';

interface Transaction {
    id: number;
    date: string;
    totalAmount: number;
    items: {
        id: number;
        quantity: number;
        product: {
            name: string;
        }
    }[];
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
    return (
        <Paper elevation={0} sx={{
            p: 3,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: 4,
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Recent Transactions
            </Typography>

            <TableContainer sx={{ flexGrow: 1 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary' }}>ID</TableCell>
                            <TableCell sx={{ bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary' }}>Time</TableCell>
                            <TableCell sx={{ bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary' }}>Items</TableCell>
                            <TableCell align="right" sx={{ bgcolor: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary' }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8, color: 'text.secondary', borderBottom: 'none' }}>
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx) => (
                                <TableRow key={tx.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s' }}>
                                    <TableCell sx={{ color: 'text.primary', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace' }}>
                                        #{tx.id.toString().padStart(4, '0')}
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {tx.items.slice(0, 2).map((item, idx) => (
                                                <Chip
                                                    key={item.id}
                                                    label={`${item.quantity}x ${item.product.name}`}
                                                    size="small"
                                                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'text.primary', fontSize: '0.75rem' }}
                                                />
                                            ))}
                                            {tx.items.length > 2 && (
                                                <Chip
                                                    label={`+${tx.items.length - 2} more`}
                                                    size="small"
                                                    sx={{ bgcolor: 'transparent', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem' }}
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        {formatCurrency(tx.totalAmount)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
