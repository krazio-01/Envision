import { toast, useToasterStore } from 'react-hot-toast';

const useToast = () => {
    const { toasts } = useToasterStore();

    const showToast = (type, message, options = {}) => {
        if (toasts.length >= 2) toast.dismiss(toasts[1].id);

        const toastOptions = {
            style: {
                background: '#333',
                color: '#fff',
            },
            ...options,
        };

        switch (type) {
            case 'success':
                toast.success(message, toastOptions);
                break;
            case 'error':
                toast.error(message, toastOptions);
                break;
            case 'loading':
                toast.loading(message, toastOptions);
                break;
            case 'custom':
                toast(
                    (t) => (
                        <div
                            className="custom-toast"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                        >
                            <span style={{ lineHeight: '1.2' }}>{message}</span>
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    whiteSpace: 'nowrap',
                                    transition: 'background 0.2s ease',
                                }}
                                onMouseEnter={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.2)')}
                                onMouseLeave={(e) => (e.target.style.background = 'rgba(255, 255, 255, 0.1)')}
                            >
                                Dismiss
                            </button>
                        </div>
                    ),
                    toastOptions,
                );
                break;
            default:
                toast(message, toastOptions);
                break;
        }
    };

    return showToast;
};

export default useToast;
