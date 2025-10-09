export   const formatPrice = (priceInCents: string | number): string => {
    const price = typeof priceInCents === 'string' ? parseInt(priceInCents) : priceInCents;
    const priceInReais = price / 100; // Converter centavos para reais
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceInReais);
};