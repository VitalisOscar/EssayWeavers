import { useContext, useEffect, useState } from "react"
import { Navigate, Route, Routes, useParams } from "react-router-dom"
import Loader from "../../../../../Shared/Components/Loader"
import { generateUrl } from "../../../../../Shared/Helpers/Misc"
import { useGetItem } from "../../../../../Shared/Hooks/Request"
import { WriterApi } from "../../../../Config/WriterApi"
import { WriterRoutes } from "../../../../Config/WriterRoutes"
import { WriterContext } from "../../../../Context/WriterContext"
import AddSubmission from "./AddSubmission"
import Main from "./Main"

export default function SingleOrder(){
    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState(null)
    const { order_id } = useParams()

    const {writerData, setWriterData} = useContext(WriterContext)
    useEffect(() => {
        setWriterData({
            ...writerData,
            pageTitle: 'View Order: ' + (order ? (' - ' + order.title) : ''),
            headerName: order ? ('Order: ' + order.title) : 'View Order',
            headerIcon: 'fa fa-list',
        })
    }, [order])

    useGetItem(
        generateUrl(WriterApi.GET_ORDER, {order_id: order_id}),
        (order) => {
            setOrder({ ...order })
            setLoading(false)
        }
    )

    if((order && order.status == 'New')){
        // Probably declined allocation
        return <Navigate to={generateUrl(WriterRoutes.LIST_ORDERS, {status: 'allocated'})} />
    }

    return loading ?
    (
        <Loader />
    )
    :
    (
        order == null ?
        <div>
            Order not found, or an error occurred
        </div>
        :
        <Routes>
            <Route path="/" element={<Main order={order} setOrder={setOrder} />} />
            <Route path="/submit-answer/:type" element={<AddSubmission order={order} setOrder={setOrder} />} />
        </Routes>
    );
}
