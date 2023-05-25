import { useState } from "react";
import Submission from "./Submission";

export default function OrderSubmissions({ order }){
    const [collapsedIndex, setCollapsedIndex] = useState(0)
    
    return (
        <div className="accordion" id="submissions">
            {
                order.submissions.map((submission, index) =>
                    <Submission
                        key={submission.id}
                        order={order}
                        data={submission}
                        index={index}
                        collapsed={(index != collapsedIndex)}
                        />
                )
            }

        </div>
    )
}
