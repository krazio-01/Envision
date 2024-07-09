import { useRef } from "react";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import SkeletonLoadingItem from "../skeletonLoading/skLoadItem/SkLoadingItem";
import MediaCard from "../content/mediaCard/MediaCard";
import "./carousel.css";

const Carousel = ({ data, loading, endpoint, title }) => {
    const carouselContainer = useRef();

    const navigation = (dir) => {
        const container = carouselContainer.current;
        const itemWidth = container.offsetWidth / 1.5;

        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - itemWidth
                : container.scrollLeft + itemWidth;

        container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    };

    return (
        <div className="carousel">
            {title && <div className="carouselTitle">{title}</div>}
            <MdArrowBackIos
                className="carouselLeftNav arrow"
                onClick={() => navigation("left")}
            />
            <MdArrowForwardIos
                className="carouselRightNav arrow"
                onClick={() => navigation("right")}
            />
            {!loading ? (
                <div className="carouselItems" ref={carouselContainer}>
                    {data?.map((item) => (
                        <MediaCard
                            key={item.id}
                            item={item}
                            endpoint={endpoint}
                        />
                    ))}
                </div>
            ) : (
                <div className="loadingSkeleton">
                    <SkeletonLoadingItem />
                    <SkeletonLoadingItem />
                    <SkeletonLoadingItem />
                    <SkeletonLoadingItem />
                    <SkeletonLoadingItem />
                    <SkeletonLoadingItem />
                    <SkeletonLoadingItem />
                    <SkeletonLoadingItem />
                </div>
            )}
        </div>
    );
};

export default Carousel;
