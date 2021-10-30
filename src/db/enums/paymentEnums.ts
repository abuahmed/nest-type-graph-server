export enum PaymentMethods {
  Cash = 'Cash',
  Credit = 'Credit',
  Check = 'Check',
}
export enum CreditLimitTypes {
  Amount = 'Amount',
  Transactions = 'Transactions',
  Both = 'Both',
}
export enum PaymentStatus {
  Draft = 'Draft',
  OnProcess = 'OnProcess',
  NotDeposited = 'NotDeposited',

  CreditNotCleared = 'CreditNotCleared',
  NotCleared = 'NotCleared',
  Cleared = 'Cleared',
  NoPayment = 'NoPayment',
  Refunded = 'Refunded',
}
export enum PaymentTypes {
  //We may only need CashIn & CashOut the others will be replaced by PaymentMethod and Sale/Purchase properties
  Sale = 'Sale',
  Purchase = 'Purchase',
  CashIn = 'CashIn',
  CashOut = 'CashOut',
  SaleCredit = 'SaleCredit',
  PurchaseCredit = 'PurchaseCredit',
}
export enum TransactionPaymentStatus {
  PartiallyPaid = 'PartiallyPaid',
  FullyPaid = 'FullyPaid',
  NoPayment = 'NoPayment',
}
export enum PaymentListTypes {
  All = 'DoNotInvoice',
  Cleared = 'Cleared',
  NotCleared = 'NotCleared',
  NotClearedAndOverdue = 'NotClearedAndOverdue',
  NotDeposited = 'NotDeposited',
  DepositedNotCleared = 'DepositedNotCleared',
  DepositedCleared = 'DepositedCleared',
  CreditNotCleared = 'CreditNotCleared',
  CheckNotCleared = 'CheckNotCleared',
  CheckCleared = 'CheckCleared',
}
export enum InvoiceTerms {
  Immediate = 'Immediate',
  AfterDelivery = 'AfterDelivery',
  AfterOrderDelivered = 'AfterOrderDelivered',
  CustomerScheduleAfterDelivery = 'CustomerScheduleAfterDelivery',
  DoNotInvoice = 'DoNotInvoice',
}
