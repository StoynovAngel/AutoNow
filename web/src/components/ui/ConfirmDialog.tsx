import { Button, Modal, ModalBody, ModalHeader } from 'flowbite-react';

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
    return (
        <Modal show={open} onClose={onCancel} size="md" popup>
            <ModalHeader>{title}</ModalHeader>
            <ModalBody>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3">
                    <Button
                        color={confirmVariant === 'danger' ? 'failure' : 'default'}
                        onClick={onConfirm}
                        className="flex-1"
                    >
                        {confirmLabel}
                    </Button>
                    <Button color="gray" onClick={onCancel} className="flex-1">
                        {cancelLabel}
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ConfirmDialog;
