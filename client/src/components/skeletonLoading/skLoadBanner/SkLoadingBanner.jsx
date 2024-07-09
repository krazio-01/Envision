import React from "react";
import "./skLoadingBanner.css";
import "../skeleton.css";

const SkeletonLoadingBanner = () => {
    return (
        <div className="swiper-slide sk">
            <div className="skeleton" />
            <div className="wrapper">
                <div className="bannerInfo">
                    <div className="name sk skeleton" />
                    <div className="meta sk">
                        <span className="skeleton" />
                        <span className="skeleton" />
                        <span className="skeleton" />
                        <span className="skeleton" />
                    </div>
                    <div className="desc sk skeleton" />
                    <div className="action sk">
                        <div className="skeleton" />
                        <div className="skeleton" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoadingBanner;
