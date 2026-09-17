const applyDiscount = (price, discount) => {
  let currentPrice = Number(price || 0);

  // Discount active નથી તો original price return
  if (!discount?.isActive) {
    return currentPrice;
  }

  const value = Number(discount.discountValue || 0);

  if (!Number.isFinite(value) || value < 0) {
    return currentPrice;
  }

  // Percentage discount
  if (discount.discountType === "percentage") {
    const percentage = Math.min(value, 100);

    currentPrice =
      currentPrice - (currentPrice * percentage) / 100;
  }

  // Fixed discount
  if (discount.discountType === "fixed") {
    currentPrice = currentPrice - value;
  }

  return Math.max(0, currentPrice);
};

export const getDiscountedPrice = (
  price,
  globalOffer,
  categoryDiscount,
  productDiscount
) => {
  let finalPrice = Number(price || 0);

  // Global Offer Discount
  finalPrice = applyDiscount(finalPrice, globalOffer);

  // Category Discount
  finalPrice = applyDiscount(finalPrice, categoryDiscount);

  // Product Discount
  finalPrice = applyDiscount(finalPrice, productDiscount);

  return Number(Math.max(0, finalPrice).toFixed(2));
};