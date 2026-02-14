import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { generateEODFileContent } from '@/utils/mallGenerator';

export async function POST(request: Request) {
    try {
        // For this demo, let's just fetch all transactions for "today" (or all time if simple)
        // To fit the "Daily Sales" requirement, we'd filter by date.
        // For now, let's aggregate EVERYTHING to show data.

        const transactions = await prisma.transaction.findMany();

        const summary = transactions.reduce((acc, curr) => {
            return {
                date: new Date().toISOString().split('T')[0],
                totalGrossSales: acc.totalGrossSales + curr.totalAmount, // Assuming totalAmount is gross
                totalVatableSales: acc.totalVatableSales + curr.vatableSales,
                totalVatAmount: acc.totalVatAmount + curr.vatAmount,
                totalVatExemptSales: acc.totalVatExemptSales + curr.vatExemptSales,
                totalDiscount: acc.totalDiscount + curr.discountAmount,
                totalServiceCharge: acc.totalServiceCharge + curr.serviceCharge,
                grandTotal: acc.grandTotal + curr.totalAmount
            };
        }, {
            date: '',
            totalGrossSales: 0,
            totalVatableSales: 0,
            totalVatAmount: 0,
            totalVatExemptSales: 0,
            totalDiscount: 0,
            totalServiceCharge: 0,
            grandTotal: 0
        });

        const fileContent = generateEODFileContent(summary);

        return new NextResponse(fileContent, {
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': `attachment; filename="EOD-${summary.date}.txt"`,
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }
}
