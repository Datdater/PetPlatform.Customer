export const formatVnPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

export function getEmailConfirmUrl(email: string, token: string) {
  const params = new URLSearchParams({ email, token });
  return `/api/v1/auth/email-confirm?${params.toString()}`;
}