import React from 'react';
import './skLoadingDetails.css';
import '../skeleton.css';

const SkLoadingDetails = () => {
    return (
        <>
            <div className="main">
                <div className="movie-player sk skeleton" />
                <div className="config sk skeleton" />
            </div>
            <div className="detailSection">
                <div className="media-image skeleton" />
                <div className="media-info">
                    <div className="title skeleton" />
                    <div className="subtitle skeleton" />
                    <div className="genres skeleton" />
                    <div className="overview skeleton" />
                    <div className="info skeleton" />
                    <div className="info skeleton" />
                    <div className="info skeleton" />
                </div>
            </div>
        </>
    )
}

export default SkLoadingDetails
