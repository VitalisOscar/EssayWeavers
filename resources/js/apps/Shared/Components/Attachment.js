import { useState } from "react";

export default function Attachment({ data, deletable=false, onDeleteChange=null }){
    let [deleted, setDeleted] = useState(false)
    
    let iconClass = "preview-icon fa fa-file-o";

    if(data.type.includes('image')){
        iconClass = "preview-icon fa fa-image"
    }else if(data.type.includes('pdf')){
        iconClass ="preview-icon fa fa-file-pdf-o"
    }else if(data.type.includes('docx')){
        iconClass ="preview-icon fa fa-file-word-o"
    }else if(data.type.includes('zip') || data.type.includes('rar')){
        iconClass ="preview-icon fa fa-file-zip-o"
    }else{
        iconClass ="preview-icon fa fa-file-o"
    }

    return (
        <div className="col-6 col-sm-4 col-md-3 col-xl-2 mb-4">
            <div className={(deletable && deleted ? 'deleted ' : '') + "attachment"}>
                <a title={data.name } key={data.id} href={data.url} target="_blank">
                    <div className="preview d-flex align-items-center justify-content-center">
                        <i className={iconClass}></i>
                    </div>

                    <h4 className="text-truncate px-3 py-2 mb-2">{ data.name }</h4>
                </a>

                {
                    deletable &&
                    <button type="button" className="btn btn-link btn-block p-2" onClick={() => {
                            setDeleted(!deleted)
                            if(onDeleteChange){
                                onDeleteChange(data.id, deleted)
                            }
                        }
                    }>
                        { deleted ? 'Restore' : 'Delete' }
                    </button>
                }
            </div>
        </div>
    )
}
