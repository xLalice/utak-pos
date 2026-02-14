"use client";

import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import ProductGrid from '@/components/ProductGrid';
import OrderSummary, { CartItem } from '@/components/OrderSummary';

export default function Home() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSenior, setIsSenior] = useState(false);

    const handleAddToCart = (product: { id: number; name: string; price: number }) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const handleRemoveOne = (id: number) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === id);
            if (existing && existing.quantity > 1) {
                return prev.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            return prev.filter((item) => item.id !== id);
        });
    };

    const handleAddOne = (item: CartItem) => {
        handleAddToCart(item);
    };

    const handleDelete = (id: number) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const handlePlaceOrder = () => {
        alert('Order Placed Successfully! (Database integration needed for real transaction)');
        setCart([]);
        setIsSenior(false);
    };

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 80px)', py: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, height: '100%' }}>

                {/* Product Grid Area */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <ProductGrid onAddToCart={handleAddToCart} />
                </Box>

                {/* Order Summary Area */}
                <Box sx={{ width: { xs: '100%', md: 400 }, minWidth: 320 }}>
                    <OrderSummary
                        cart={cart}
                        onAdd={handleAddOne}
                        onRemove={handleRemoveOne}
                        onDelete={handleDelete}
                        isSenior={isSenior}
                        setIsSenior={setIsSenior}
                        onPlaceOrder={handlePlaceOrder}
                    />
                </Box>

            </Box>
        </Container>
    );
}
