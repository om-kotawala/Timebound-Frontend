
import React, { memo } from 'react'

const Spinner = memo(({ size = 20, color = 'rgb(var(--volt-300))' }) => (
  <div
    style={{
      width: size, height: size, border: '2px solid rgb(var(--volt-300) / 0.15)',
      borderTop: `2px solid ${color}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite',
    }}
  />
))

export default Spinner
