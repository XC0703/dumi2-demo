import { PictureClip } from 'dumi2-demo'
import React, { useState } from 'react'

const App: React.FC = () => {
  const [isClipOpen, setIsClipOpen] = useState<boolean>(false)

  const onClip = (clipInfo: any) => {
    console.log(clipInfo)
    setIsClipOpen(false)
  }

  return (
    <>
      <div
        onClick={() => {
          setIsClipOpen(true)
        }}
        style={{ cursor: 'pointer' }}
      >
        点我
      </div>
      <PictureClip
        onClip={onClip}
        onClose={() => {
          setIsClipOpen(false)
        }}
        clipMethod='custom'
        open={isClipOpen}
        resource={
          'https://business.xiongmaoboshi.com/test/web-assets/0a787855b11c84b1c6acfec6c78bb5f2.jpg'
        }
      />
    </>
  )
}

export default App
