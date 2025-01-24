import React from 'react'
import style from './loader.module.scss'

const Loader = () => {
  const { snippet, stage, dotPulse } = style

  return (
    <div className={snippet} data-title="dot-pulse">
      <div className={stage}>
        <div className={dotPulse} />
      </div>
    </div>
  )
}

export default Loader
