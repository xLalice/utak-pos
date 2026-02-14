import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            items,
            totalAmount,
            vatableSales,
            vatAmount,
            vatExemptSales,
            discountAmount,
            serviceCharge
        } = body;

        const transaction = await prisma.transaction.create({
            data: {
                totalAmount,
                vatableSales,
                vatAmount,
                vatExemptSales,
                discountAmount,
                serviceCharge,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        priceAtTime: item.price
                    }))
                }
            }
        });

        return NextResponse.json(transaction);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            take: 50,
            orderBy: {
                date: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        return NextResponse.json(transactions);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}
