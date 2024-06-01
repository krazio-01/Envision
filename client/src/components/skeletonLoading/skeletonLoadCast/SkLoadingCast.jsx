import React from 'react';
import './skLoadingCast.css';
import '../skeleton.css';

const SkeletonLoadingCast = () => {
    return (
        <div className="skItem">
            <div className="circle skeleton"></div>
            <div className="row skeleton"></div>
            <div className="row2 skeleton"></div>
        </div>
    )
}

export default SkeletonLoadingCast
