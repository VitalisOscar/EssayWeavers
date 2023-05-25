import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'

export default function TextEditor({ text = '', onChange = null }){
    return (
        <CKEditor
            editor={ ClassicEditor }
            data={text}
            onChange={ ( event, editor ) => {
                if(onChange) onChange(editor.getData())
            } }
        />
    )
}
