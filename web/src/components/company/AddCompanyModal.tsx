import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import CompanyForm from './CompanyForm';
import type { CompanyPayload } from '../../services/company/companyService';

interface AddCompanyModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (payload: CompanyPayload) => Promise<void>;
}

const AddCompanyModal = ({ show, onClose, onSubmit }: AddCompanyModalProps) => {
    return (
        <Modal show={show} onClose={onClose} size="2xl" dismissible>
            <ModalHeader>Add Company</ModalHeader>
            <ModalBody>
                <CompanyForm
                    submitLabel="Add Company"
                    submittingLabel="Adding..."
                    onSubmit={async (payload) => {
                        await onSubmit(payload);
                        onClose();
                    }}
                    onCancel={onClose}
                />
            </ModalBody>
        </Modal>
    );
};

export default AddCompanyModal;
