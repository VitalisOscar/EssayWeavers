import { useContext, useEffect, useState } from "react"
import { Route, Routes, useParams } from "react-router-dom"
import Loader from "../../../../../Shared/Components/Loader"
import { generateUrl } from "../../../../../Shared/Helpers/Misc"
import { useGetItem } from "../../../../../Shared/Hooks/Request"
import { AdminApi } from "../../../../Config/AdminApi"
import { AdminContext } from "../../../../Context/AdminContext"
import { OrderContext } from "../../../../Context/OrderContext"
import AllocateOrder from "./AllocateOrder"
import EditOrder from "./EditOrder"
import Main from "./Main"

export default function SingleOrder(){
    const {order, setOrder} = useContext(OrderContext)

    const {adminData, setAdminData} = useContext(AdminContext)
    useEffect(() => {
        setAdminData({
            ...adminData,
            pageTitle: 'Manage Order' + (order ? (' - ' + order.title) : ''),
            headerName: order ? ('Order: ' + order.title) : 'Manage Order',
            headerIcon: 'fa fa-list',
        })
    }, [order])

    const [loading, setLoading] = useState(true)

    const { order_id } = useParams()

    useGetItem(
        generateUrl(AdminApi.GET_ORDER, {order_id: order_id}),
        (order) => {
            setOrder({ ...order })
            setLoading(false)
        }
    )

    function addFine(){

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
            <Route path="/" element={<Main />} />
            <Route path="/allocate" element={<AllocateOrder />} />
            <Route path="/edit" element={<EditOrder />} />
        </Routes>
    );
}
