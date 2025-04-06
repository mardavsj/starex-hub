const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="bg-base-200 border border-base-content/30 p-6 rounded-lg w-full max-w-md flex flex-col justify-between items-center">
                <h2 className="text-xl font-semibold text-center mb-2">Are you sure?</h2>

                <p className="text-sm text-base-content/70 text-center mb-6">
                    {message}
                </p>

                <div className="flex justify-center gap-3 w-full">
                    <button
                        className="w-full px-4 py-2 font-semibold rounded bg-primary/20 hover:bg-primary/30 border border-transparent hover:border-primary"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="w-full px-4 py-2 font-semibold text-red-500 rounded bg-red-500/20 hover:bg-red-500/30 border border-transparent hover:border-red-500"
                        onClick={onConfirm}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;