import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField, // Using standard MUI TextField
  Alert,
  CircularProgress,
} from '@mui/material'; // Assuming these are available in starterkit

// Placeholder for a logo if available, similar to other login pages
// import Logo from 'src/layouts/full/shared/logo/Logo';
import PageContainer from 'src/components/container/PageContainer';
import { logInfo, logError } from '../../utils/logger';
import { postRequest } from '../../api/djungelApi.js'; // Import postRequest

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    logInfo('Login attempt initiated for email:', email);

    try {
      // The djungelApi.js postRequest prepends /api to the endpoint
      const data = await postRequest('/login', { email, password }); 
      
      // postRequest throws an error for non-ok responses, so if we reach here, it was successful.
      // data should be the parsed JSON response.
      if (data.token) {
        logInfo('Login successful. Token received.', { email });
        localStorage.setItem('authToken', data.token);
        navigate('/dashboard');
      } else {
        // This case might be less likely if backend always returns token on success or errors out
        logError('Login successful, but no token received in data.', { email, responseData: data });
        setError('Login successful, but no token was provided by the server.');
      }
    } catch (err) { // err is an object like { status, data } from djungelApi or other Error
      logError('Login API error:', { error: err, email });
      // err.data from djungelApi contains the backend's JSON error response
      const message = err.data?.message || err.message || 'Login request failed. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer title="Login" description="Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '100vh' }}
        >
          <Box
            sx={{
              p: 4,
              width: '100%',
              maxWidth: '400px',
              background: 'white',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
            }}
          >
            {/* <Box display="flex" justifyContent="center" mb={3}> */}
            {/*   <Logo /> // Placeholder for logo */}
            {/* </Box> */}
            <Typography fontWeight="700" variant="h4" mb={1}>
              Sign In
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" mb={3}>
              Welcome back! Please sign in to continue.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px">
                    Email Address
                  </Typography>
                  <TextField
                    id="email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px">
                    Password
                  </Typography>
                  <TextField
                    id="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Box>
                {/* Optional: Remember me and Forgot password */}
                {/* <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                  <Typography component={Link} to="/auth/forgot-password" fontWeight="500" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                    Forgot Password ?
                  </Typography>
                </Stack> */}
              </Stack>
              <Box mt={3}>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </Box>
            </form>
            {/* Optional: Link to Register page */}
            {/* <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
              <Typography color="textSecondary" variant="h6" fontWeight="400">
                New to Modernize?
              </Typography>
              <Typography component={Link} to="/auth/register" fontWeight="500" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                Create an account
              </Typography>
            </Stack> */}
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

export default Login;
