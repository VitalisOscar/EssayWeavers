import React from 'react';

export default function DataTable({
    columns,
    data,
}) {

    // Colspan for whole table span width
    var colspan = columns.length + 1

    var columnHeaderList = []
    var columnKeyList = []

    for(const column in columns){
        columnHeaderList.push(columns[column])
        columnKeyList.push(column)
    }

    return (
        <div>

            <div>
                <table className="table table-striped" style={{maxWidth: '100%'}}>

                    <tbody>
                        <tr className="sticky-top bg-default text-white">
                            <td><strong>#</strong></td>
                            {
                                columnHeaderList.map(column => (
                                    <td><strong>{{ column }}</strong></td>
                                ))
                            }
                            <td></td>
                        </tr>

                        {
                            (result.items ?? []).map((item, index) => {

                                // Check if not last item
                                if(index !== filters.limit){
                                    var time = item.last_activity.timestamp ?? item.last_activity.time

                                    var d = time.split(" ")[0].split("-")
                                    var date = format(new Date(d[0], d[1] - 1, d[2]), 'PP')

                                    var last_activity = date + (item.last_activity.site ? (" at " + item.last_activity.site.name) : "")

                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                {
                                                    getItemNumber(
                                                        index, filters.page, filters.limit
                                                    )
                                                }
                                            </td>

                                            <td>
                                                {item.name}
                                            </td>

                                            <td style={{maxWidth: '200px'}}>
                                                {item.id_number}
                                            </td>

                                            <td style={{maxWidth: '150px'}}>
                                                {item.phone}
                                            </td>

                                            <td>
                                                {item.from}
                                            </td>

                                            <td style={{maxWidth: '150px'}}>
                                                {last_activity}
                                            </td>

                                            <td>
                                                <Link to={generateFullUrl(APP_ROUTES.SINGLE_VISITOR, {visitor_id: item.id})}>
                                                    View Visitor
                                                    <i className="ml-2 fa fa-share"></i>
                                                </Link>
                                            </td>

                                        </tr>

                                    )

                                }
                            })
                        }

                    </tbody>

                </table>
            </div>

            {/* START PAGINATION */}
            <div className="card-footer py-4">
                <nav className="d-flex align-items-center">
                    <ul className="pagination justify-content-center aligh-items-center mb-0">
                        <li className={(filters.page === 1 ? "disabled ":"") + " page-item"}>
                            <a style={{cursor: 'pointer'}} className="page-link" onClick={prevPage}>
                                <i className="fas fa-angle-left"></i>
                                <span className="sr-only">Previous</span>
                            </a>
                        </li>

                        <li className="mx-3 d-flex align-items-center">
                            Page {filters.page}
                        </li>

                        <li className={(result.total_items <= result.limit ? "disabled ":"") + " page-item"}>
                            <a style={{cursor: 'pointer'}} className="page-link" onClick={nextPage}>
                                <i className="fas fa-angle-right"></i>
                                <span className="sr-only">Next</span>
                            </a>
                        </li>

                    </ul>

                    <div className="ml-auto">
                        <select value={filters.limit} onChange={updateItemsLimit} className="custom-select">
                            <option value="15">15 per page</option>
                            <option value="30">30 per page</option>
                            <option value="50">50 per page</option>
                            <option value="100">100 per page</option>
                        </select>
                    </div>
                </nav>
            </div>
            {/* END PAGINATION */}

        </div>
    );
}
