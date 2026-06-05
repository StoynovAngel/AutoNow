import { Modal, ModalBody, ModalHeader } from 'flowbite-react';
import CompanyForm from './CompanyForm';
import type { Company } from './CompanyInfo';
import type { CompanyPayload } from '../../services/company/companyService';

interface EditCompanyModalProps {
    show: boolean;
    company: Company;
    onClose: () => void;
    onSubmit: (payload: CompanyPayload) => Promise<void>;
}

const EditCompanyModal = ({ show, company, onClose, onSubmit }: EditCompanyModalProps) => {
    return (
        <Modal show={show} onClose={onClose} size="2xl" dismissible>
            <ModalHeader>Edit Company</ModalHeader>
            <ModalBody>
                <CompanyForm
                    initialData={company}
                    submitLabel="Save Changes"
                    submittingLabel="Saving..."
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

export default EditCompanyModal;
