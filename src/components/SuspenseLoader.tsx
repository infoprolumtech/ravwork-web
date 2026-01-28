import { Box, CircularProgress } from '@mui/material';

const SuspenseLoader = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999, // High z-index to overlay everything
                bgcolor: 'background.default'
            }}
        >
            <CircularProgress size={60} thickness={4} />
        </Box>
    );
};

export default SuspenseLoader;
