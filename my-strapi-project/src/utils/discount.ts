type DiscountType = "percentage" | "fixed";

interface Offer {
  isActive: boolean;
  discountType: DiscountType;
  discountValue: number;
}

export function calculateDiscountedPrice(
  price: number,
  offer: Offer | null
): number {
  if (!offer || !offer.isActive) {
    return price;
  }

  const discountValue = Number(offer.discountValue);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Invalid product price");
  }

  if (!Number.isFinite(discountValue) || discountValue < 0) {
    throw new Error("Invalid discount value");
  }

  let discountAmount = 0;

  if (offer.discountType === "percentage") {
    if (discountValue > 100) {
      throw new Error("Percentage cannot exceed 100");
    }

    discountAmount = (price * discountValue) / 100;
  }

  if (offer.discountType === "fixed") {
    discountAmount = discountValue;
  }

  const finalPrice = Math.max(0, price - discountAmount);

  return Number(finalPrice.toFixed(2));
}