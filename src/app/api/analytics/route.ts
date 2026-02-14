import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function GET() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            todayTransactions,
            totalSalesRaw,
            transactionCount
        ] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    date: {
                        gte: today
                    }
                }
            }),
            prisma.transaction.aggregate({
                _sum: {
                    totalAmount: true
                },
                where: {
                    date: {
                        gte: today
                    }
                }
            }),
            prisma.transaction.count({
                where: {
                    date: {
                        gte: today
                    }
                }
            })
        ]);

        const totalSales = totalSalesRaw._sum.totalAmount || 0;
        const averageOrderValue = transactionCount > 0 ? totalSales / transactionCount : 0;

        return NextResponse.json({
            totalSales,
            transactionCount,
            averageOrderValue,
            todayTransactions
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
