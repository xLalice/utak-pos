import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, CardMedia, Skeleton } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image?: string;
}

interface ProductGridProps {
    onAddToCart: (product: Product) => void;
}

export default function ProductGrid({ onAddToCart }: ProductGridProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load products", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Menu</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rectangular" height={200} />)}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Menu
            </Typography>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)'
                },
                gap: 2
            }}>
                {products.map((product) => (
                    <Box key={product.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardActionArea
                                onClick={() => onAddToCart(product)}
                                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}
                            >
                                {product.image ? (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={product.image}
                                        alt={product.name}
                                    />
                                ) : (
                                    <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                                        <ShoppingCart sx={{ fontSize: 40, color: 'text.secondary' }} />
                                    </Box>
                                )}
                                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                                    <Typography variant="h6" component="div" noWrap>
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ₱{product.price.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
