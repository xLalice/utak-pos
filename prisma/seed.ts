import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const products = [
        { name: 'Espresso', price: 120, category: 'Coffee', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&auto=format&fit=crop&q=60' },
        { name: 'Latte', price: 150, category: 'Coffee', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60' },
        { name: 'Cappuccino', price: 150, category: 'Coffee', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop&q=60' },
        { name: 'Mocha', price: 170, category: 'Coffee', image: 'https://images.unsplash.com/photo-1596078841242-12f73dc697c6?w=500&auto=format&fit=crop&q=60' },
        { name: 'Croissant', price: 90, category: 'Pastry', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60' },
        { name: 'Choco Muffin', price: 100, category: 'Pastry', image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&auto=format&fit=crop&q=60' },
        { name: 'Club Sandwich', price: 250, category: 'Mains', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=60' },
        { name: 'Pasta Carbonara', price: 300, category: 'Mains', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&auto=format&fit=crop&q=60' },
    ];

    try {
        await prisma.transactionItem.deleteMany();
        await prisma.transaction.deleteMany();
        await prisma.product.deleteMany();
    } catch (e) {
        console.log('Database might be fresh, skipping cleanup');
    }

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
        console.log(`Created product: ${product.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
