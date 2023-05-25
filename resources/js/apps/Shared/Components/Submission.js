import { useOrderMetricsTimeToDeadline } from "../../Admin/Hooks/Order";
import Attachment from "./Attachment";

export default function Submission({ data, order, index, collapsed=true }){
    let filesCount = '0 Files'
    if(data.attachments){
        filesCount = data.attachments.length + ' File' + (data.attachments.length == 1 ? '':'s')
    }

    const reviewTime = useOrderMetricsTimeToDeadline((order.writer_deadline_raw || order.deadline_raw), data.date_raw)

    return (
        <div className="card shadow-none mb-2 border">
            <div className="card-header py-2 px-3">
                <h5 className="mb-0" data-toggle="collapse" data-target={"#submission"+index}>
                    {
                        data.is_final ? <strong className="text-success">FINAL: </strong>
                        :<></>
                    }
                    <button className="px-0 btn btn-link shadow-none"  type="button">
                        {data.date}
                    </button>
                    <span>{'(' + filesCount + ')'}</span>
                </h5>
            </div>

            <div id={"submission"+index} className={"collapse " + (collapsed ? '':'show')} data-parent="#submissions">
                <div className="card-body">
                    <div className="mb-4" dangerouslySetInnerHTML={{__html: data.answer}}></div>

                    {
                        data.attachments && data.attachments.length > 0 ?
                            <div className="attachments">
                                <div className="row">
                                {
                                    data.attachments.map(attachment => <Attachment key={attachment.id} data={attachment} />)
                                }
                                </div>
                            </div>
                            :<></>
                    }

                    <div>
                        <span>Submitted&nbsp;</span>
                        <strong style={{fontSize: '1.1em'}} className={reviewTime.positive ? 'text-success' : 'text-danger'}>{reviewTime.difference}</strong>
                        <span>
                            {reviewTime.positive ? ' before' : ' after'} deadline
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
