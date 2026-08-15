import orderService from '@/services/order.service';

export async function downloadInvoice(orderNumber: string) {
  const blob = await orderService.downloadInvoice(orderNumber);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bhavita-invoice-${orderNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
