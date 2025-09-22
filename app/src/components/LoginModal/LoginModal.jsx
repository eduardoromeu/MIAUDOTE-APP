import React from 'react';
import { Box, Modal } from '@mui/material';

// 1. Importe o formulário de login que já corrigimos
import LoginForm from '../LoginForm/LoginForm';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// 2. O modal agora apenas exibe o LoginForm
export default function LoginModal({ open, onClose }) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {/* O modal agora usa o componente de formulário que já funciona! */}
                <LoginForm />
            </Box>
        </Modal>
    );
}