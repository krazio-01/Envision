import useToast from '../../../hooks/useToast';
import useUserStore from '../../../store/store';
import { MdDeleteOutline } from 'react-icons/md';
import apiClient from '../../../api/apiClient';
import './removeBtn.css';

const RemoveBtn = ({ media, mediaType, setIsRemoved }) => {
    const toast = useToast();
    const user = useUserStore((state) => state.user);

    const handleRemove = async () => {
        if (!user) {
            toast('error', 'Please login to use this feature');
            return;
        }

        try {
            const { data } = await apiClient.post('/activity/removeBookmark', { mediaId: media.id, mediaType });
            setIsRemoved((prev) => !prev);
            toast('success', data.message);
        } catch (error) {
            toast('error', error.response?.data?.message);
        }
    };

    return (
        <div className="remove-btn">
            <button className="action-btn" onClick={handleRemove}>
                <MdDeleteOutline />
            </button>
        </div>
    );
};

export default RemoveBtn;
