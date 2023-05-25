const AdminRoutes = {

    DASHBOARD: '/',
    UPDATE_PASSWORD: '/password',

    // Payouts
    LIST_PAYOUTS: '/payouts/list',
    ADD_PAYOUT: '/payouts/add',

    // Orders
    LIST_ORDERS: '/orders/list',
    SINGLE_ORDER: '/orders/view/:order_id',
    ADD_ORDER: '/orders/add',

    // Writers
    LIST_WRITERS: '/writers/list',
    ADD_WRITER: '/writers/add',
    SINGLE_WRITER: '/writers/view/:writer_id',

    // Sources
    LIST_SOURCES: '/sources/list',
    ADD_SOURCE: '/sources/add',
    SINGLE_SOURCE: '/sources/view/:source_id',

}

export { AdminRoutes };
