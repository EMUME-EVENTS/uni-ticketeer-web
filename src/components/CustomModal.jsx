import "react-responsive-modal/styles.css"
import { Modal } from "react-responsive-modal"

export default function CustomModal({
    isOpen, 
    showCloseBtn, 
    shouldCloseOnOverlayClick, 
    closeModal, 
    children,
    isLoadingModal
}){
    return(
        <div>
            <Modal 
                open={isOpen}
                onClose={closeModal}
                showCloseIcon={showCloseBtn}
                center
                styles={{
                    modal: {
                        margin: 0
                    }
                }}
                classNames={{
                    modalContainer: !isLoadingModal && 'modalContainer',
                    modal: 'modals'
                }}
            >
                <div className="pt-6 pb-6">
                    {children}
                </div>
            </Modal>
        </div>
    )
}