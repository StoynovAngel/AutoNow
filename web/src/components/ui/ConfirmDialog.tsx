interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

const VARIANT_CLASSES: Record<NonNullable<ConfirmDialogProps['confirmVariant']>, string> = {
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    primary: 'bg-violet-600 hover:bg-violet-700 text-white',
};

const ConfirmDialog = ({
    open,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    confirmVariant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
                <h3 id="confirm-dialog-title" className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className={`flex-1 ${VARIANT_CLASSES[confirmVariant]} font-semibold py-2 px-4 rounded-lg transition-colors text-sm`}
                    >
                        {confirmLabel}
                    </button>
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                        {cancelLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
