import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../../Shared/Components/Loader";
import { generateUrl, getItemNumber, showError } from "../../../../Shared/Helpers/Misc";
import { get } from "../../../../Shared/Helpers/Request";
import { WriterApi } from "../../../Config/WriterApi";
import { WriterRoutes } from "../../../Config/WriterRoutes";
import { WriterContext } from "../../../Context/WriterContext";

export default function ListOrders(){
    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        page: 1,
        limit: 15
    })

    const { status } = useParams()

    const {writerData, setWriterData} = useContext(WriterContext)
    useEffect(() => {
        let s = ''
        if(status == 'allocated') s = 'New Orders'
        if(status == 'active') s = 'In Progress'
        if(status == 'completed') s = 'Complete Orders'
        if(status == 'cancelled') s = 'Cancelled Orders'
        if(status == 'settled') s = 'Settled Orders'
        if(status == 'need-review') s = 'Need Review'
        setWriterData({
            ...writerData,
            pageTitle: s,
            headerName: s,
            headerIcon: 'fa fa-list',
        })
    }, [status])

    // Route param just changed, therefore status is different
    // need to trigger state change so that data can be fetched for the new status
    if(filters.status == undefined || filters.status != status){
        setFilters({ ...getResetFilters(), status: status })
    }

    useEffect(getOrders, [filters])

    function getResetFilters(){
        return {
            page: 1,
            limit: 15
        }
    }

    function getOrders(){
        get(generateUrl(WriterApi.LIST_ORDERS, filters))
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

                <div className="card-header rounded-top d-flex align-items-center" style={{background: '#f6f9fc'}}>
                    <h2 className="heading-title mb-0 font-weight-700">{writerData.headerName ?? 'Orders'}</h2>
                </div>

                <div>
                    <table className="table table-striped" style={{maxWidth: '100%'}}>

                        <tbody>
                            <tr className="sticky-top bg-default text-white">
                                <td><strong>#</strong></td>
                                <td><strong>Title</strong></td>
                                <td><strong>Price</strong></td>
                                <td><strong>Deadline</strong></td>
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
                                                {item.price_formatted}
                                            </td>

                                            <td>
                                                {item.deadline_formatted}
                                            </td>

                                            <td>
                                                <Link to={generateUrl(WriterRoutes.SINGLE_ORDER, {order_id: item.id})}>
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
