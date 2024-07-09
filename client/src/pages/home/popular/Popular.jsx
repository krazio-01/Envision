import useMediaCarousel from "../../../hooks/useMediaCarousel";
import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/Ui/switchTabs/SwitchTabs";
import "../home.css";

const Popular = () => {
    const { data, loading, endpoint, onTabChange } = useMediaCarousel(
        "movie",
        "popular"
    );

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">What's Popular</span>
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

export default Popular;
