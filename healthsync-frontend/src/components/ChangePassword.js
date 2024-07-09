import React, { useState } from 'react';
import { Container,Box, TextField, Button, Typography, Alert, CircularProgress, IconButton, InputAdornment, Paper } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
const ChangePassword = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (event) => {
        setPasswords({
            ...passwords,
            [event.target.name]: event.target.value
        });
    };

    const handleTogglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field]
        });
    };

    const validatePassword = (password) => {
        return password.length >= 8 && /[0-9]/.test(password) && /[A-Z]/.test(password);
    };

    const handleSubmit = async () => {
        if (!validatePassword(passwords.newPassword)) {
            setError("New password must be at least 8 characters long, include a number, and an uppercase letter.");
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetch('http://localhost:5000/api/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_password: passwords.currentPassword,
                    new_password: passwords.newPassword
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to change password');
            }
            setSuccess(data.msg);
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component={Paper} maxWidth="sm" sx={{ p: 4, mt: 4, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 2 , justifyContent: 'center'}}>
            <LockIcon color="primary" />
            <Typography variant="h5" color="primary" >
                Change Password
            </Typography>
        </Box>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <TextField
                label="Current Password"
                type={showPassword.current ? 'text' : 'password'}
                name="currentPassword"
                fullWidth
                margin="normal"
                variant="outlined"
                value={passwords.currentPassword}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleTogglePasswordVisibility('current')}
                            >
                                {showPassword.current ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <TextField
                label="New Password"
                type={showPassword.new ? 'text' : 'password'}
                name="newPassword"
                fullWidth
                margin="normal"
                variant="outlined"
                value={passwords.newPassword}
                onChange={handleChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => handleTogglePasswordVisibility('new')}
                            >
                                {showPassword.new ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Change Password"}
            </Button>
        </Container>
    );
};

export default ChangePassword;
