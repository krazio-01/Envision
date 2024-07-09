import PosterFallback from "../assets/images/no-poster.jpg";
import Avatar from "../assets/images/avatar.png";

const generateImageUrl = (path, size = "original", isCast = false) => {
    if (!path) {
        return isCast ? Avatar : PosterFallback;
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

export { generateImageUrl };