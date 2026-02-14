import React, { useEffect, useState } from 'react';
import { Card, CardActionArea, CardContent, Typography, Box, CardMedia, Skeleton, Button } from '@mui/material';
import { ShoppingCart, Add } from '@mui/icons-material';

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
                    <Card key={product.id} sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-5px)',
                            '& .product-image': {
                                transform: 'scale(1.1)',
                            }
                        }
                    }}>
                        <Box sx={{ position: 'relative', pt: '75%', overflow: 'hidden' }}>
                            <CardMedia
                                component="img"
                                image={product.image}
                                alt={product.name}
                                className="product-image"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                            />
                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)',
                                p: 2,
                                pt: 6
                            }}>
                                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    {product.name}
                                </Typography>
                            </Box>
                        </Box>
                        <CardContent sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                                    {product.category}
                                </Typography>
                                <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                                    ₱{product.price.toFixed(2)}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => onAddToCart(product)}
                                sx={{ minWidth: 40, width: 40, height: 40, borderRadius: '50%', p: 0 }}
                            >
                                <Add />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}
