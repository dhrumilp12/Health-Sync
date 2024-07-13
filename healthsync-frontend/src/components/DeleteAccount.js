import React, { useContext, useState } from 'react';
import { Container, TextField, Button, Typography, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, CircularProgress } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const DeleteAccount = () => {
    
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const handleChange = (event) => {
        setPassword(event.target.value);
    };
    const {setIsLoggedIn} = useContext(AuthContext)

    const handleDelete = async () => {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch('http://localhost:5000/api/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to delete account');
            }
            setIsLoggedIn(false);
            // Navigate or refresh the page here as needed
            window.location = '/login'; // Redirect to login or home page after account deletion
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openConfirmationDialog = () => {
        // Ensure there's a password before showing the dialog
        if (!password) {
            setError("Please enter your password first.");
            return;
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="xs" sx={{ p: 4, mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
                Danger Zone
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Please enter your password to confirm you want to permanently delete your account.
            </Typography>
            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
            <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={handleChange}
                sx={{ my: 2 }}
            />
            <Button
                variant="contained"
                color="error"
                onClick={openConfirmationDialog}
                disabled={loading}
                fullWidth
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Delete Account"}
            </Button>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Account Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting your account is irreversible. All your data will be permanently removed. Are you absolutely sure?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Confirm Deletion
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DeleteAccount;
