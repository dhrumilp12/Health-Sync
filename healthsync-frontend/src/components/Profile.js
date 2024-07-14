import React, { useState, useEffect } from 'react';
import { Typography,Box, Card, CardContent, Grid, Container, CircularProgress, Alert, Button, Divider, TextField, Avatar, useTheme } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const editableFields = new Set([
        'first_name',
        'last_name',
        'gender',
        'phone_number',
        'language_preference',
        'notification_enabled',
        'medical_conditions',
        'medications',
        'doctor_contacts',
        'emergency_contacts',
        'sos_location'
    ]);

    const fetchProfile = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("Access token not found. Please log in.");
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Profile data:', data);
            if (response.ok) {
                setUserData(data);
            } else {
                throw new Error(data.msg || 'Failed to fetch profile');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleChange = (event, field, index, subField) => {
        if (index !== undefined && subField !== undefined) {
            const updatedArray = [...userData[field]];
            updatedArray[index][subField] = event.target.value;
            setUserData({ ...userData, [field]: updatedArray });
        } else if (Array.isArray(userData[field])) {
            setUserData({ ...userData, [field]: event.target.value.split(',').map(item => item.trim()) });
        } else {
            setUserData({ ...userData, [field]: event.target.value });
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError("Access token not found. Please log in.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                setEditMode(false);
                fetchProfile(); // Refresh the data
            } else {
                throw new Error(data.msg || 'Failed to update profile');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const formatNestedObject = (key, value) => {
        if (Array.isArray(value)) {
            return value.map((item, index) => (
                <Box key={index} sx={{ mb: 1, ml: 2 }}>
                    {Object.entries(item).map(([subKey, subValue]) => (
                        <Typography key={subKey} variant="body2">
                            <strong>{subKey.charAt(0).toUpperCase() + subKey.slice(1)}:</strong> {subValue}
                        </Typography>
                    ))}
                </Box>
            ));
        }
        return value.toString();
    };
    
    const renderEditableNestedObject = (key, value) => {
        if (Array.isArray(value)) {
            return value.map((item, index) => (
                <Box key={index} sx={{ mb: 1, ml: 2 }}>
                    {Object.entries(item).map(([subKey, subValue]) => (
                        <TextField
                            key={subKey}
                            label={subKey.charAt(0).toUpperCase() + subKey.slice(1).replace(/_/g, ' ')}
                            fullWidth
                            variant="outlined"
                            value={subValue}
                            onChange={(e) => handleChange(e, key, index, subKey)}
                            sx={{ mb: 1 }}
                        />
                    ))}
                </Box>
            ));
        }
        return <TextField label={key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')} fullWidth variant="outlined" value={value} onChange={(e) => handleChange(e, key)} />;
    };

    const formatBoolean = (value) => {
        return value ? 'True' : 'False';
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                    {error && <Alert severity="error">{error}</Alert>}
                    {loading ? (
                        <CircularProgress />
                    ) : userData ? (
                        <Card raised sx={{ boxShadow: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
                                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                        <AccountCircleIcon />
                                    </Avatar>
                                    <Typography variant="h4" component="h2" color="primary">
                                        Profile Details
                                    </Typography>
                                    {editMode ? (
                                        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} color="primary">
                                            Save
                                        </Button>
                                    ) : (
                                        <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditToggle} color="primary">
                                            Edit Profile
                                        </Button>
                                    )}
                                </Box>
                                <Divider sx={{ my: 2 }} />
                                <Grid container spacing={2}>
                                    {Object.entries(userData).map(([key, value]) => (
                                        <Grid item xs={12} md={6} key={key}>
                                            {editMode && editableFields.has(key) ? (
                                                typeof value === 'object' && value !== null ? (
                                                    renderEditableNestedObject(key, value)
                                                ) : (
                                                    <TextField
                                                        label={key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                                                        fullWidth
                                                        variant="outlined"
                                                        value={value}
                                                        onChange={(e) => handleChange(e, key)}
                                                    />
                                                )
                                            ): (
                                                <Box>
                                                    <Typography variant="body1">
                                                        <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:</strong>
                                                    </Typography>
                                                    {typeof value === 'boolean' ? (
                                                        <Typography variant="body2">{formatBoolean(value)}</Typography>
                                                    ) : typeof value === 'object' ? (
                                                        formatNestedObject(key, value)
                                                    ) : (
                                                        <Typography variant="body2">{value}</Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    ) : (
                        <Typography variant="subtitle1">No profile data available.</Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;