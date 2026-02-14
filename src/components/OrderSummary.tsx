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
import { Calculate, RestartAlt, ReceiptLong, Add, Remove, Delete } from '@mui/icons-material';
import { calculateTransaction, formatCurrency } from '../utils/taxEngine';
import FeedbackDialog, { FeedbackType } from './FeedbackDialog';

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
    const [feedback, setFeedback] = useState<{ open: boolean; type: FeedbackType; title: string; message: string }>({
        open: false,
        type: 'info',
        title: '',
        message: ''
    });

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
                setFeedback({
                    open: true,
                    type: 'success',
                    title: 'Success!',
                    message: 'Transaction recorded successfully.'
                });
                onPlaceOrder(); // Clears cart in parent
            } else {
                setFeedback({
                    open: true,
                    type: 'error',
                    title: 'Transaction Failed',
                    message: 'Could not record transaction. Please try again.'
                });
            }
        } catch (e) {
            console.error(e);
            setFeedback({
                open: true,
                type: 'error',
                title: 'Connection Error',
                message: 'Failed to connect to the server.'
            });
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

                setFeedback({
                    open: true,
                    type: 'success',
                    title: 'Report Generated',
                    message: 'The EOD report has been downloaded.'
                });
            } else {
                setFeedback({
                    open: true,
                    type: 'error',
                    title: 'Report Failed',
                    message: 'Could not generate the daily report.'
                });
            }
        } catch (e) {
            console.error(e);
            setFeedback({
                open: true,
                type: 'error',
                title: 'Error',
                message: 'An unexpected error occurred.'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Paper sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 0,
            bgcolor: 'background.paper',
            overflow: 'hidden'
        }} elevation={10}>
            <Box sx={{ p: 3, pb: 2, bgcolor: 'rgba(255, 255, 255, 0.03)' }}>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                    ORDER SUMMARY
                </Typography>
                <Typography variant="h4" fontWeight="800" sx={{ mt: 1 }}>
                    Current Bill
                </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'auto', px: 3, mb: 2 }}>
                {cart.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                        <ReceiptLong sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="body1">No items yet</Typography>
                    </Box>
                ) : (
                    <List disablePadding>
                        {cart.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListItem
                                    disableGutters
                                    sx={{ py: 2 }}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)} size="small" sx={{ color: 'error.main', opacity: 0.7, '&:hover': { opacity: 1 } }}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    }
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', pr: 6 }}>
                                            <Typography variant="body1" fontWeight="600">{item.name}</Typography>
                                            <Typography variant="body1" fontWeight="600">{formatCurrency(item.price * item.quantity)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 8 }}>
                                                <IconButton size="small" onClick={() => onRemove(item.id)} sx={{ p: 0.5 }}>
                                                    <Remove fontSize="small" sx={{ fontSize: 16 }} />
                                                </IconButton>
                                                <Typography variant="caption" sx={{ mx: 1.5, fontWeight: 'bold' }}>{item.quantity}</Typography>
                                                <IconButton size="small" onClick={() => onAdd(item)} sx={{ p: 0.5 }}>
                                                    <Add fontSize="small" sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                                @ {formatCurrency(item.price)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                                <Divider sx={{ borderStyle: 'dashed', opacity: 0.5 }} />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Box>

            <Paper elevation={20} sx={{ p: 3, bgcolor: 'background.default', borderRadius: '24px 24px 0 0', mx: -0.5, mb: -0.5, border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isSenior}
                                onChange={(e) => setIsSenior(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={<Typography variant="body2" color="text.secondary">Apply Senior/PWD Discount</Typography>}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                        <Typography variant="body2" fontWeight="600">{formatCurrency(subtotal)}</Typography>
                    </Box>

                    {isSenior ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">VAT Exempt Sales</Typography>
                                <Typography variant="body2">{formatCurrency(summary.vatExemptSales)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="success.main">Discount (20%)</Typography>
                                <Typography variant="body2" color="success.main">-{formatCurrency(summary.discountAmount)}</Typography>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">VAT (12%)</Typography>
                            <Typography variant="body2" color="text.secondary">{formatCurrency(summary.vatAmount)}</Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Service Charge (10%)</Typography>
                        <Typography variant="body2" color="text.secondary">{formatCurrency(summary.serviceCharge)}</Typography>
                    </Box>

                </Box>

                <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">TOTAL</Typography>
                    <Typography variant="h4" fontWeight="800" color="primary.main">
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
                    sx={{ mb: 1.5, py: 1.5, fontSize: '1.1rem', borderRadius: 3 }}
                >
                    {isProcessing ? <CircularProgress size={24} color="inherit" /> : 'CHARGE ORDER'}
                </Button>

                <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    size="small"
                    onClick={handleGenerateReport}
                    disabled={isProcessing}
                    sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                    {isProcessing ? 'Generating...' : 'Generate EOD Report'}
                </Button>
            </Paper>

            <FeedbackDialog
                open={feedback.open}
                onClose={() => setFeedback({ ...feedback, open: false })}
                type={feedback.type}
                title={feedback.title}
                message={feedback.message}
            />
        </Paper>
    );
}
