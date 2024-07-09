import useToast from "../../../hooks/useToast";
import useUserStore from "../../../store/store";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import "./removeBtn.css";

const RemoveBtn = ({ media, mediaType, setIsRemoved }) => {
    const toast = useToast();
    const user = useUserStore((state) => state.user);

    const handleRemove = async () => {
        if (!user) {
            toast("error", "Please login to use this feature");
            return;
        }

        try {
            const { data } = await axios.post(
                "/bookmark/removeBookmark",
                { mediaId: media.id, mediaType },
                { withCredentials: true }
            );
            setIsRemoved(prev => !prev);
            toast("success", data.message);
        } catch (error) {
            toast("error", error.response?.data?.message);
        }
    };

    return (
        <div className="remove-btn">
            <button className="action-btn" onClick={handleRemove} >
                <MdDeleteOutline />
            </button>
        </div>
    );
};

export default RemoveBtn;
