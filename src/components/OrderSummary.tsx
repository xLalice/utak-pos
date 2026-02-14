import React, { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    FormControlLabel,
    Switch,
    Button,
    Paper,
    CircularProgress
} from '@mui/material';
import { Add, Remove, Delete, ReceiptLong } from '@mui/icons-material';
import { calculateTransaction, formatCurrency } from '../utils/taxEngine';

// Reuse type or import if shared properly
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface OrderSummaryProps {
    cart: CartItem[];
    onAdd: (item: CartItem) => void;
    onRemove: (id: number) => void;
    onDelete: (id: number) => void;
    isSenior: boolean;
    setIsSenior: (val: boolean) => void;
    onPlaceOrder: () => void; // Optional: Keep for parent notification if needed
}

export default function OrderSummary({
    cart,
    onAdd,
    onRemove,
    onDelete,
    isSenior,
    setIsSenior,
    onPlaceOrder
}: OrderSummaryProps) {

    const [isProcessing, setIsProcessing] = useState(false);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const summary = useMemo(() =>
        calculateTransaction(subtotal, isSenior, true),
        [subtotal, isSenior]);

    const handleCharge = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    ...summary
                })
            });

            if (response.ok) {
                alert('Transaction Recorded Successfully!');
                onPlaceOrder(); // Clears cart in parent
            } else {
                alert('Failed to record transaction');
            }
        } catch (e) {
            console.error(e);
            alert('Error connecting to server');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleGenerateReport = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/reports/mall', {
                method: 'POST'
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const header = response.headers.get('Content-Disposition');
                const filename = header?.split('filename=')[1]?.replace(/"/g, '') || 'report.txt';
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('Failed to generate report');
            }
        } catch (e) {
            console.error(e);
            alert('Error generating report');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
                Current Order
            </Typography>

            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
                {cart.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 4, textAlign: 'center' }}>
                        No items in cart
                    </Typography>
                ) : (
                    <List dense>
                        {cart.map((item) => (
                            <ListItem
                                key={item.id}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                                        <Delete fontSize="small" color="error" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={item.name}
                                    secondary={`${formatCurrency(item.price)} x ${item.quantity}`}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                                    <IconButton size="small" onClick={() => onRemove(item.id)}>
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    <Typography variant="body2" sx={{ mx: 1 }}>{item.quantity}</Typography>
                                    <IconButton size="small" onClick={() => onAdd(item)}>
                                        <Add fontSize="small" />
                                    </IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box sx={{ mb: 2 }}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isSenior}
                            onChange={(e) => setIsSenior(e.target.checked)}
                            color="secondary"
                        />
                    }
                    label="Senior/PWD Discount"
                />
            </Box>

            <Box sx={{ mb: 2, '& > div': { display: 'flex', justifyContent: 'space-between', mb: 0.5 } }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">{formatCurrency(subtotal)}</Typography>

                {isSenior ? (
                    <>
                        <Typography variant="body2">VAT Exempt Sales:</Typography>
                        <Typography variant="body2">{formatCurrency(summary.vatExemptSales)}</Typography>
                        <Typography variant="body2" color="success.main">Less Discount (20%):</Typography>
                        <Typography variant="body2" color="success.main">-{formatCurrency(summary.discountAmount)}</Typography>
                    </>
                ) : (
                    <>
                        <Typography variant="body2" color="text.secondary">Vatable Sales:</Typography>
                        <Typography variant="body2" color="text.secondary">{formatCurrency(summary.vatableSales)}</Typography>
                        <Typography variant="body2" color="text.secondary">VAT (12%):</Typography>
                        <Typography variant="body2" color="text.secondary">{formatCurrency(summary.vatAmount)}</Typography>
                    </>
                )}

                <Typography variant="body2">Service Charge (10%):</Typography>
                <Typography variant="body2">{formatCurrency(summary.serviceCharge)}</Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="h6" fontWeight="bold">Total:</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                    {formatCurrency(summary.totalAmount)}
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCharge}
                disabled={cart.length === 0 || isProcessing}
                sx={{ mb: 1 }}
            >
                {isProcessing ? <CircularProgress size={24} color="inherit" /> : `Charge ${formatCurrency(summary.totalAmount)}`}
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                fullWidth
                startIcon={<ReceiptLong />}
                onClick={handleGenerateReport}
                disabled={isProcessing}
            >
                {isProcessing ? 'Generating...' : 'Wait! Generate Mall File'}
            </Button>
        </Paper>
    );
}
