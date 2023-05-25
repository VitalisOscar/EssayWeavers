import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../../../Shared/Components/Loader";
import { generateUrl, getItemNumber, showError } from "../../../../Shared/Helpers/Misc";
import { get } from "../../../../Shared/Helpers/Request";
import { AdminApi } from "../../../Config/AdminApi";
import { AdminRoutes } from "../../../Config/AdminRoutes";
import { AdminContext } from "../../../Context/AdminContext";

export default function ListOrders(){
    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Orders',
            headerName: 'Orders',
            headerIcon: 'fas fa-book',
        })
    }, [])

    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        page: 1,
        limit: 15,
    })
    const [search, setSearch] = useState('')

    useEffect(getOrders, [filters])

    function getOrders(){
        get(generateUrl(AdminApi.LIST_ORDERS, filters))
            .then(result => {
                setResult(result)
                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                setLoading(false)

                showError('An exception occurred')
            })
    }

    // Pagination
    function prevPage(){
        if(filters.page > 1){
            filters.page -= 1
            setFilters({...filters })

            setLoading(true)
        }
    }

    function nextPage(){
        // Check if more items are available
        if(result.next_page_url != null){
            filters.page += 1
            setFilters({...filters })

            setLoading(true)
        }
    }


    // Items Limit
    function updateItemsLimit(event){
        filters.limit = event.target.value
        filters.page = 1 // Reset page to 1

        setFilters({ ...filters })
    }

    return loading ?
    (
        <Loader />
    )
    :
    (
        <div>
            {/* DATA TABLE */}
            <div className="card content-card">

                <div className="card-header rounded-top">
                    <div className="d-flex align-items-center mb-3">
                        <h2 className="heading-title mb-0 font-weight-700">Orders</h2>

                        <Link to={AdminRoutes.ADD_ORDER} className="btn btn-outline-primary py-2 ml-auto">
                            <i className="fa fa-plus mr-1"></i>Add New
                        </Link>
                    </div>

                    <div className="d-flex align-items-center">
                        <select style={{ width: '150px' }} value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="custom-select mr-3">
                            <option value="all">All Orders</option>
                            <option value="new">New Orders</option>
                            <option value="allocated">Allocated</option>
                            <option value="active">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="need-revision">Need Revision</option>
                            <option value="settled">Settled</option>
                        </select>

                        <div className="">
                            <form className="input-group" onSubmit={(e) => {e.preventDefault(); setFilters({ ...filters, search: search })}}>
                                <input className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={"Search " + (filters.status != 'need-revision' ? (filters.status + " orders") : 'orders in revision') } />
                                <div className="input-group-append">
                                    <button className="btn btn-dark shadow-none">Search</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div>
                    <table className="table table-striped" style={{maxWidth: '100%'}}>

                        <tbody>
                            <tr className="sticky-top bg-default text-white">
                                <td><strong>#</strong></td>
                                <td><strong>Title</strong></td>
                                <td><strong>Source</strong></td>
                                <td><strong>Price</strong></td>
                                <td><strong>Added</strong></td>
                                <td><strong>Deadline</strong></td>
                                <td><strong>Status</strong></td>
                                <td><strong>Writer</strong></td>
                                <td></td>
                            </tr>

                            {/* NO RESULT */}
                            {
                                ((result.data ?? []).length == 0) ?

                                <tr>
                                    <td colSpan="9">
                                        No data in table
                                    </td>
                                </tr>
                                // END NO RESULTS
                                :
                                // START RESULTS

                                (result.data ?? []).map((item, index) => {
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
                                                {item.title}
                                            </td>

                                            <td>
                                                {item.source.name}
                                            </td>

                                            <td>
                                                {item.price_formatted}
                                            </td>

                                            <td>
                                                {item.date}
                                            </td>

                                            <td>
                                                {item.deadline_formatted}
                                            </td>

                                            <td>
                                                {item.status}
                                            </td>

                                            <td>
                                                {item.current_writer ? item.current_writer.name : '-'}
                                            </td>

                                            <td>
                                                <Link to={generateUrl(AdminRoutes.SINGLE_ORDER, {order_id: item.id})}>
                                                    View
                                                    <i className="ml-2 fa fa-share"></i>
                                                </Link>
                                            </td>

                                        </tr>
                                    )
                                })
                            }
                            {/* END RESULTS */}

                        </tbody>

                    </table>
                </div>

                {/* DATA TABLE FOOTER */}
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

                            <li className={(result.next_page_url == null ? "disabled ":"") + " page-item"}>
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
                {/* END DATA TABLE FOOTER */}

            </div>
            {/* END DATA TABLE */}
        </div>
    );

}
