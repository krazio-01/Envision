import React from 'react';
import './skLoadingItem.css';

const SkeletonLoading = () => {
    return (
        <div className="media-item">
            <div className="posterBlock sk skeleton"></div>
            <div className="textBlock">
                <div className="title skeleton"></div>
                <div className="misc sk skeleton"></div>
            </div>
        </div>
    )
}

export default SkeletonLoading;