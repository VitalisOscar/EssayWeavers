const WriterRoutes = {

    DASHBOARD: '/',
    UPDATE_PASSWORD: '/password',

    // Payouts
    LIST_PAYOUTS: '/payments/paid',
    LIST_EARNINGS: '/payments/earnings',
    LIST_FINES: '/payments/fines',

    // Orders
    LIST_ORDERS: '/orders/list/:status',
    SINGLE_ORDER: '/orders/view/:order_id',

}

export { WriterRoutes };
