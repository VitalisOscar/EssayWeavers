const BASE = '/ajax/writer/'

const WriterApi = {

    DASHBOARD_DATA: BASE + 'dashboard-data',
    PROFILE: BASE + 'profile',

    // Payments
    LIST_PAYOUTS: BASE + 'payments/payouts/',
    LIST_FINES: BASE + 'payments/fines/',
    LIST_EARNINGS: BASE + 'payments/earnings/',

    // Orders
    LIST_ORDERS: BASE + 'orders/list/:status',
    GET_ORDER: BASE + 'orders/single/:order_id',
    DECLINE_ALLOCATION: BASE + 'orders/single/:order_id/decline-allocation',
    ACCEPT_ALLOCATION: BASE + 'orders/single/:order_id/accept-allocation',
    ADD_SUBMISSION: BASE + 'orders/single/:order_id/add-submission',

    // Other
    GET_ORDER_STATUS_COUNTERS: BASE + 'data/orders/status-counters',
}

export { WriterApi };
