export default [
  'View Transfer',
  'Add Transfer',
  'Post Transfer',
  'UnPost Transfer',
  'Delete Transfer',
];
// export default [
//   //'Admin',
//   'View Dashboard',

//   //   'Client Profile',
//   //   'Organization Profile',
//   //   'Add Stores',

//   //   'Settings',
//   //   'Advanced Settings',
//   //   'Tax Settings',
//   //   'General Settings',

//   //   'Update Stores',
//   //   //'Add/Edit Bank Account',
//   'Users Management',
//   //'Users Privilege Management',

//   'OnHand Inventory',
//   //'Reserve Items',
//   //'Items Quantity',

//   'Physical Inventory',
//   'View Physical Inventory',
//   'Add Physical Inventory',
//   'Post Physical Inventory',
//   'UnPost Physical Inventory',
//   'Delete Physical Inventory',
//   'Pi Lines History',

//   'Customers Entry',
//   //'Customers Advanced',
//   'Vendors Entry',

//   'Items Entry',
//   //   'Item Categories',
//   //   'Item Unit Of Measures',

//   'Sales',
//   'View Sales',
//   'Add Sales',
//   'Post Sales',
//   'UnPost Sales',
//   'Delete Sales',
//   'Sales Lines History',
//   //   'Sales Payments',

//   'Purchase',
//   'View Purchase',
//   'Add Purchase',
//   'Post Purchase',
//   'UnPost Purchase',
//   'Delete Purchase',
//   'Purchase Lines History',
//   //   'Purchase Payments',

//   //   'Payments',
//   //   'Add Checks',
//   //   'Deposit Payments',
//   //   'Clear Payments',
//   //   'Expenses and Loans',

//   //   'Cpo',
//   //   'Item Borrows',

//   //   'View Reports',

// 'View Transfer',
//   'Add Transfer',
//   'Post Transfer',
//   'UnPost Transfer',
//   'Delete Transfer',
// ];

export enum Role {
  ViewDashboard = 'View Dashboard',

  Users = 'Users',
  Customers = 'Customers Entry',
  Vendors = 'Vendors Entry',
  Items = 'Items Entry',

  OnHandInventory = 'OnHand Inventory',

  //PI = 'Physical Inventory',
  ViewPI = 'View PI',
  AddPI = 'Add PI',
  PostPI = 'Post PI',
  UnPostPI = 'UnPost PI',
  DeletePI = 'Delete PI',
  //HistoryPI = 'Pi Lines History',

  //Sales = 'Sales',
  ViewSale = 'View Sale',
  AddSale = 'Add Sale',
  PostSale = 'Post Sale',
  UnPostSale = 'UnPost Sale',
  DeleteSale = 'Delete Sale',
  //HistorySales = 'Sales Lines History',

  //Purchase = 'Purchase',
  ViewPurchase = 'View Purchase',
  AddPurchase = 'Add Purchase',
  PostPurchase = 'Post Purchase',
  UnPostPurchase = 'UnPost Purchase',
  DeletePurchase = 'Delete Purchase',
  //HistoryPurchase = 'Purchase Lines History',
}
