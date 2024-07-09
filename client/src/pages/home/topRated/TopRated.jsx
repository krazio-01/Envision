import useMediaCarousel from "../../../hooks/useMediaCarousel";
import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/Ui/switchTabs/SwitchTabs";
import "../home.css";

const TopRated = () => {
    const { data, loading, endpoint, onTabChange } = useMediaCarousel(
        "movie",
        "top_rated"
    );

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">Top Rated</span>
                <SwitchTabs
                    data={["Movies", "Tv Shows"]}
                    onTabChange={onTabChange}
                />
            </ContentWrapper>

            <Carousel
                data={data?.results}
                loading={loading}
                endpoint={endpoint}
            />
        </div>
    );
};

export default TopRated;