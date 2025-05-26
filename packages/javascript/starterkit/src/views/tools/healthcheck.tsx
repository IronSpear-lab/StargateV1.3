import React, { useState } from 'react';
import { Box, Typography, Button, Alert, CircularProgress, Grid, Paper } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { getRequest, postRequest, postFormDataRequest } from '../../api/djungelApi'; // Adjusted path

interface ApiResult {
  response?: any;
  error?: any;
}

interface ApiTestSectionProps {
  title: string;
  endpoint: string;
  method: string;
  onTest: () => void;
  response?: any;
  error?: any;
  isLoading?: boolean;
}

const ApiTestSection: React.FC<ApiTestSectionProps> = ({ title, endpoint, method, onTest, response, error, isLoading }) => (
  <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2" color="textSecondary">{method} /api{endpoint}</Typography> {/* Display full path */}
    <Button variant="contained" onClick={onTest} disabled={isLoading} sx={{ my: 1 }}>
      {isLoading ? <CircularProgress size={24} /> : 'Test Endpoint'}
    </Button>
    {error && <Alert severity="error" sx={{ mt: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{typeof error === 'string' ? error : JSON.stringify(error, null, 2)}</Alert>}
    {response && <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: '#f5f5f5', padding: '10px', marginTop: '8px', maxHeight: '300px', overflowY: 'auto' }}>{JSON.stringify(response, null, 2)}</pre>}
  </Paper>
);

const HealthCheck: React.FC = () => {
  const [results, setResults] = useState<Record<string, ApiResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [authToken, setAuthToken] = useState<string | null>(null);

  const handleTest = async (apiKey: string, callApi: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [apiKey]: true }));
    setResults(prev => ({ ...prev, [apiKey]: { response: null, error: null } }));
    try {
      const data = await callApi();
      setResults(prev => ({ ...prev, [apiKey]: { response: data, error: null } }));
      if (apiKey === 'login' && data.token) {
        setAuthToken(data.token);
      }
    } catch (err: any) {
      console.error(`Error testing ${apiKey}:`, err);
      // err structure from djungelApi is { status, data }
      const errorMessage = err.data || err.message || 'An unknown error occurred';
      setResults(prev => ({ ...prev, [apiKey]: { response: null, error: errorMessage } }));
    } finally {
      setLoading(prev => ({ ...prev, [apiKey]: false }));
    }
  };

  const apiEndpoints = [
    {
      key: 'health',
      title: 'Backend Health',
      endpoint: '/health',
      method: 'GET',
      action: () => handleTest('health', () => getRequest('/health'))
    },
    {
      key: 'login',
      title: 'Login (Mock)',
      endpoint: '/login',
      method: 'POST',
      action: () => handleTest('login', () => postRequest('/login', { email: 'test@example.com', password: 'password' }))
    },
    {
      key: 'userMe',
      title: 'Get User (Protected)',
      endpoint: '/user/me',
      method: 'GET',
      action: () => {
        if (!authToken) {
          setResults(prev => ({ ...prev, userMe: { response: null, error: 'Login first to get auth token.' }}));
          return;
        }
        handleTest('userMe', () => getRequest('/user/me', authToken))
      }
    },
    {
      key: 'getFiles',
      title: 'Get Files List',
      endpoint: '/files',
      method: 'GET',
      action: () => handleTest('getFiles', () => getRequest('/files')) // Assuming /files is not protected for this example
    },
    {
      key: 'uploadFile',
      title: 'Upload File (Mock)',
      endpoint: '/upload',
      method: 'POST',
      action: () => {
        const formData = new FormData();
        formData.append('testFile', new Blob(['This is dummy file content'], {type: 'text/plain'}), 'test.txt');
        // Assuming /upload might be protected, pass authToken if available and needed
        // For simplicity, not passing token here, adjust if your backend /upload requires it
        handleTest('uploadFile', () => postFormDataRequest('/upload', formData /*, authToken */))
      }
    },
  ];

  return (
    <PageContainer title="Backend Health Check" description="Test integration with Djungel backend APIs">
      <Box>
        <Typography variant="h4" gutterBottom>Djungel Backend API Health Check</Typography>
        {authToken && <Typography variant="subtitle2" sx={{mb:2}}>Auth Token: {authToken.substring(0, 30)}...</Typography>}
        <Grid container spacing={3}>
          {apiEndpoints.map(api => (
            <Grid item xs={12} md={6} key={api.key}>
              <ApiTestSection
                title={api.title}
                endpoint={api.endpoint}
                method={api.method}
                onTest={api.action}
                response={results[api.key]?.response}
                error={results[api.key]?.error}
                isLoading={loading[api.key]}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default HealthCheck;
