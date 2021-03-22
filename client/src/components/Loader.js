import React from 'react'

export const Loader = () => (
    <div style={{display: 'flex', justifyContent: 'center'}}>
        <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
)