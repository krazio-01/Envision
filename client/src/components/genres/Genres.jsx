import "./genres.css";

const Genres = ({ genres }) => {
    return (
        <div className="genres">
            {genres?.map((g) => {
                return (
                    <div key={g.id} className="genre">
                        {g?.name}
                    </div>
                );
            })}
        </div>
    );
};

export default Genres;
