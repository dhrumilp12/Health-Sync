import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const LogoutButton = () => {
    const [loading, setLoading] = React.useState(false);

    const handleLogout = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');  // Assuming JWTs are stored in localStorage

        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to logout');
            }
            // Clear local storage or any other client-side storage
            localStorage.removeItem('accessToken');
            // Redirect or perform other clean up actions
            window.location = '/login'; // Redirect to login page after logout
        } catch (err) {
            console.error(err.message); // Log errors or show them in UI as needed
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <ExitToAppIcon />}
        >
            {loading ? 'Logging out...' : 'Logout'}
        </Button>
    );
};

export default LogoutButton;
