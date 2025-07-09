export interface Recipient {
  name: string;
  phone: string;
}

export interface BulkSmsFormData {
  recipients: Recipient[];
  message: string;
  totalCost: number;
  receiptId?: string;
}
