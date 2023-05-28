const BASE = '/ajax/admin/'

const AdminApi = {
    DASHBOARD_DATA: BASE + 'dashboard-data',
    PROFILE: BASE + 'profile',

    // Payouts
    LIST_PAYOUTS: BASE + 'payments/all',
    ADD_PAYOUT: BASE + 'payments/add',

    // Orders
    LIST_ORDERS: BASE + 'orders/list',
    ADD_ORDER: BASE + 'orders/add',
    GET_ORDER: BASE + 'orders/single/:order_id',
    ALLOCATE_ORDER: BASE + 'orders/single/:order_id/allocate',
    DELETE_ALLOCATION: BASE + 'orders/single/:order_id/delete-allocation',
    ADD_ORDER_ISSUE: BASE + 'orders/single/:order_id/add-issue',
    SETTLE_ORDER: BASE + 'orders/single/:order_id/settle',
    CANCEL_ORDER: BASE + 'orders/single/:order_id/cancel',
    ADD_PAYMENT: BASE + 'orders/single/:order_id/add-payment',
    EDIT_ORDER_PRICE: BASE + 'orders/single/:order_id/edit-order-price',
    EDIT_WRITER_DEADLINE: BASE + 'orders/single/:order_id/edit-writer-deadline',
    EDIT_ORDER: BASE + 'orders/single/:order_id/edit-order',

    // Writers
    LIST_WRITERS: BASE + 'writers/all',
    ADD_WRITER: BASE + 'writers/add',
    GET_WRITER: BASE + 'writers/single/:writer_id',
    UPDATE_WRITER: BASE + 'writers/single/:writer_id/update',

    // Sources
    LIST_SOURCES: BASE + 'sources/all',
    ADD_SOURCE: BASE + 'sources/add',
    GET_SOURCE: BASE + 'sources/single/:source_id',
    UPDATE_SOURCE: BASE + 'sources/single/:source_id/update',

    // Bidders
    LIST_BIDDERS: BASE + 'bidders/all',
    ADD_BIDDER: BASE + 'bidders/add',
    GET_BIDDER: BASE + 'bidders/single/:bidder_id',
    UPDATE_BIDDER: BASE + 'bidders/single/:bidder_id/update',

    // Other
    PAYMENT_RECEPIENT_TYPES: BASE + 'data/payments/recepient_types',
    PAYMENT_RECEPIENTS: BASE + 'data/payments/recepients',

    ORDER_SOURCE_TYPES: BASE + 'data/orders/source_types',
    ORDER_SOURCES: BASE + 'data/orders/sources',
    ORDER_BIDDERS: BASE + 'data/orders/bidders',
    WRITERS: BASE + 'data/writers/all',
}

export { AdminApi };
