import React from 'react'

function ImageUploadModal( {isOpen , onClose , type , onImageSelect}:{isOpen:boolean , onClose:()=>void , type:string , onImageSelect:(imageData:any)=>void}) {
    if(!isOpen){
        return null;
    }
  return (
    <div>
        <div>
            <h2>Upload Image</h2>
            <button onClick={onClose}>Close</button>
        </div>
    </div>
  )
}

export default ImageUploadModal