import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./cast.css";
import { MdArrowForwardIos, MdArrowBackIos } from "react-icons/md";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Img from "../../../components/lazyLoadImage/Img";
import avatar from "../../../assets/images/avatar.png";
import SkeletonLoadingCast from "../../../components/skeletonLoading/skeletonLoadCast/SkLoadingCast";

const Cast = ({ }) => {
    const { mediaType, id } = useParams();
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(false);

    const { url } = useSelector((state) => state.home);
    const castContainer = useRef();

    const navigation = (dir) => {
        const container = castContainer.current;
        const itemWidth = container.offsetWidth / 1.5;

        const scrollAmount =
            dir === "left"
                ? container.scrollLeft - itemWidth
                : container.scrollLeft + itemWidth;

        container.scrollTo({ left: scrollAmount, behavior: "smooth" });
    };

    const fetchCrewInfo = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/${mediaType}/crew?id=${id}`);
            setCast(data.cast);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data from the backend:", error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCrewInfo();
    }, []);

    return (
        <div className="castSection">
            <ContentWrapper>
                <div className="sectionHeading">Top Cast</div>

                <MdArrowBackIos
                    className="castSectionLeftNav arrow"
                    onClick={() => navigation("left")}
                />
                <MdArrowForwardIos
                    className="castSectionRightNav arrow"
                    onClick={() => navigation("right")}
                />

                {!loading ? (
                    <div className="listItems" ref={castContainer}>
                        {cast?.map((item) => {
                            let imgUrl = item.profile_path
                                ? url.profile + item.profile_path
                                : avatar;
                            return (
                                <div key={item.id} className="listItem">
                                    <div className="profileImg">
                                        <Img src={imgUrl} />
                                    </div>
                                    <div className="name">{item.name}</div>
                                    <div className="character">{item.character}</div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="castSkeleton">
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                        <SkeletonLoadingCast />
                    </div>
                )}
            </ContentWrapper>
        </div>
    );
};

export default Cast;