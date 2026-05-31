export function formatOrderNo(orderId: number | string | null | undefined) {
  const numericOrderId = Number(orderId || 0);

  if (!numericOrderId) {
    return 'ORD-000';
  }

  return `ORD-${String(numericOrderId).padStart(3, '0')}`;
}
