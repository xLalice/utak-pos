import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { generateEODFileContent } from '@/utils/mallGenerator';
import type { DailySalesSummary } from '@/utils/mallGenerator';

export async function POST(request: Request) {
    try {

        const transactions = await prisma.transaction.findMany();
        const today = new Date().toLocaleDateString('en-CA');

        const summary = transactions.reduce((acc: DailySalesSummary, curr: any) => {
            return {
                ...acc,
                totalGrossSales: acc.totalGrossSales + curr.totalAmount,
                totalVatableSales: acc.totalVatableSales + curr.vatableSales,
                totalVatAmount: acc.totalVatAmount + curr.vatAmount,
                totalVatExemptSales: acc.totalVatExemptSales + curr.vatExemptSales,
                totalDiscount: acc.totalDiscount + curr.discountAmount,
                totalServiceCharge: acc.totalServiceCharge + curr.serviceCharge,
                grandTotal: acc.grandTotal + curr.totalAmount
            };
        }, {
            date: today,
            totalGrossSales: 0,
            totalVatableSales: 0,
            totalVatAmount: 0,
            totalVatExemptSales: 0,
            totalDiscount: 0,
            totalServiceCharge: 0,
            grandTotal: 0
        } as DailySalesSummary);

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
