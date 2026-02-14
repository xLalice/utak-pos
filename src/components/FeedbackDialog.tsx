
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    useTheme
} from '@mui/material';
import { CheckCircle, Error, Info } from '@mui/icons-material';

export type FeedbackType = 'success' | 'error' | 'info';

interface FeedbackDialogProps {
    open: boolean;
    onClose: () => void;
    type: FeedbackType;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function FeedbackDialog({
    open,
    onClose,
    type,
    title,
    message,
    actionLabel = 'Okay',
    onAction
}: FeedbackDialogProps) {
    const theme = useTheme();

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />;
            case 'error': return <Error sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />;
            default: return <Info sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />;
        }
    };

    const handleAction = () => {
        if (onAction) onAction();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    minWidth: 300,
                    textAlign: 'center',
                    p: 2,
                    background: 'rgba(30, 41, 59, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                {getIcon()}
                <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', p: 0, mb: 1 }}>
                    {title}
                </DialogTitle>
            </Box>
            <DialogContent>
                <DialogContentText sx={{ color: 'text.secondary' }}>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                    variant="contained"
                    color={type === 'error' ? 'error' : 'primary'}
                    onClick={handleAction}
                    sx={{ minWidth: 120, borderRadius: 2 }}
                >
                    {actionLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
