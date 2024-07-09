import { toast, useToasterStore } from "react-hot-toast";

const useToast = () => {
    const { toasts } = useToasterStore();

    const showToast = (type, message, options = {}) => {
        if (toasts.length >= 2) toast.dismiss(toasts[1].id);

        const toastOptions = {
            style: {
                background: "#333",
                color: "#fff",
            },
            ...options,
        };

        switch (type) {
            case "success":
                toast.success(message, toastOptions);
                break;
            case "error":
                toast.error(message, toastOptions);
                break;
            case "loading":
                toast.loading(message, toastOptions);
                break;
            case "custom":
                toast(
                    (t) => (
                        <div
                            className="custom-toast"
                            style={{
                                display: "flex",
                                padding: "3px",
                                borderRadius: "5px",
                            }}
                        >
                            {message}
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                style={{
                                    marginLeft: "5px",
                                    border: "none",
                                    paddingInline: "10px",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Dismiss
                            </button>
                        </div>
                    ),
                    toastOptions
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
