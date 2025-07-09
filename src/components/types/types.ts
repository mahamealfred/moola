export interface Transaction {
  transactionId: string
  date: string
  serviceName: string
  status: 'Completed' | 'Pending' | 'Failed' | string
  amount: number
}
