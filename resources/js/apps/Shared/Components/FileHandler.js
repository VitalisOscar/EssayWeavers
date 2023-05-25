import { useRef, useState } from 'react'
import './FileHandler.css'

export default function FileHandler({ previousFiles = [], onChange = null, multiple=true, size='medium' }){
    const [files, setFiles] = useState(previousFiles)
    const [dragActive, setDragActive] = useState(false);

    const inputRef = useRef(null);

    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleAddedFiles(e.dataTransfer.files);
        }
    };

    const inputChanged = function(e) {
        e.preventDefault();

        if (e.target.files && e.target.files[0]) {
            handleAddedFiles(e.target.files);
        }
    };

    const onClick = () => {
        inputRef.current.click();
    };

    function handleAddedFiles(newFiles){
        if(multiple){   
            files.push(...newFiles);
        }else{
            setFiles([newFiles[0]])
        }

        setFiles([...files])
        if(onChange) onChange([...files])
    }

    function removeFile(index){
        files.splice(index, 1);
        setFiles([ ...files ])
        if(onChange) onChange([...files])
    }

    return (
        <>
            <div className={(dragActive ? "drag-active " : "") + (size) + " uploadHandler text-center mb-4" }
                onClick={onClick}
                onDragEnter={handleDrag}
                >

                <div className="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>
                
                <div>
                    {
                        multiple ?
                            'Click to select files or drag and drop files here' :
                            'Click to select a file or drag and drop a file here'
                    }
                </div>

            </div>

            <input ref={inputRef} type="file" className='d-none' multiple={multiple} onChange={inputChanged} />

            <div className="row uploaded-files">

                {
                    files.map((file, index) => (
                        <div className="col-sm-6" key={index}>
                            <div className="file d-flex align-items-center">
                                <i className="fa fa-file mr-3"></i>

                                <span className="file-name text-truncate">
                                    {file.name}
                                </span>

                                <span className="remove-file ml-auto" onClick={() => removeFile(index)}>
                                    <i className="fa fa-times text-danger"></i>
                                </span>
                            </div>
                        </div>
                    ))
                }

            </div>
        </>
    )
}
