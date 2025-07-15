import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string | number): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('vi-VN').format(numAmount) + ' đ';
}

export function generateTransactionId(): string {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('vi-VN');
}

export function getBillTypeDisplay(billType: string): string {
  const types = {
    'electricity': 'Điện',
    'water': 'Nước',
    'internet': 'Internet',
    'tv': 'Truyền hình',
    'television': 'Truyền hình',
    'phonecard': 'Thẻ cào điện thoại'
  };
  return types[billType as keyof typeof types] || billType;
}

export function getStatusDisplay(status: string): { text: string; className: string } {
  const statusMap = {
    'pending': { text: 'Chưa thanh toán', className: 'text-warning' },
    'paid': { text: 'Đã thanh toán', className: 'text-success' },
    'completed': { text: 'Hoàn thành', className: 'text-success' },
    'overdue': { text: 'Quá hạn', className: 'text-destructive' },
    'failed': { text: 'Thất bại', className: 'text-destructive' }
  };
  
  return statusMap[status as keyof typeof statusMap] || { text: status, className: 'text-muted-foreground' };
}

export function getPaymentMethodDisplay(method: string): string {
  const methods = {
    'qr': 'QR Code',
    'bank': 'Chuyển khoản',
    'ewallet': 'Ví điện tử'
  };
  return methods[method as keyof typeof methods] || method;
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
