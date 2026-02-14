import { TaxBreakdown } from './taxEngine';

interface DailySalesSummary {
    date: string; // YYYY-MM-DD
    totalGrossSales: number; // Sum of all items before tax logic
    totalVatableSales: number;
    totalVatAmount: number;
    totalVatExemptSales: number;
    totalDiscount: number;
    totalServiceCharge: number;
    grandTotal: number;
}

export const generateEODFileContent = (summary: DailySalesSummary): string => {
    // Fixed width or CSV? 
    // Let's do CSV for simplicity as a "Flat File" often implies either.
    // Malls often want fixed width, but CSV is safer for a demo unless specs provided.
    // Let's do a Pipe Delimited file, cleaner than CSV.

    const header = "DATE|GROSS|VATABLE|VAT|EXEMPT|DISCOUNT|SVC_CHG|TOTAL";
    const row = [
        summary.date,
        summary.totalGrossSales.toFixed(2),
        summary.totalVatableSales.toFixed(2),
        summary.totalVatAmount.toFixed(2),
        summary.totalVatExemptSales.toFixed(2),
        summary.totalDiscount.toFixed(2),
        summary.totalServiceCharge.toFixed(2),
        summary.grandTotal.toFixed(2)
    ].join('|');

    return `${header}\n${row}`;
};

export const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
