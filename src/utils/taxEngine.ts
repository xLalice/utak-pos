export interface TaxBreakdown {
    vatableSales: number;
    vatAmount: number;
    vatExemptSales: number;
    discountAmount: number;
    serviceCharge: number;
    totalAmount: number;
}

export const VAT_RATE = 0.12;
export const SERVICE_CHARGE_RATE = 0.10;
export const SENIOR_DISCOUNT_RATE = 0.20;

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount);
};

export const calculateTransaction = (
    subtotal: number,
    isSenior: boolean,
    hasServiceCharge: boolean
): TaxBreakdown => {
    let vatableSales = 0;
    let vatAmount = 0;
    let vatExemptSales = 0;
    let discountAmount = 0;
    let serviceCharge = 0;
    let totalAmount = 0;

    if (isSenior) {
        const netOfVat = subtotal / (1 + VAT_RATE);
        vatExemptSales = netOfVat;

        discountAmount = vatExemptSales * SENIOR_DISCOUNT_RATE;

        totalAmount = vatExemptSales - discountAmount;
    } else {
        vatableSales = subtotal / (1 + VAT_RATE);
        vatAmount = subtotal - vatableSales;
        totalAmount = subtotal;
    }

    if (hasServiceCharge) {
        const baseForSC = isSenior ? vatExemptSales : subtotal;
        serviceCharge = baseForSC * SERVICE_CHARGE_RATE;
        totalAmount += serviceCharge;
    }

    return {
        vatableSales,
        vatAmount,
        vatExemptSales,
        discountAmount,
        serviceCharge,
        totalAmount
    };
};
