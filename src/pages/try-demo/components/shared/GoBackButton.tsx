import type { JSX } from "react";
import { Box } from "@mui/material";

interface GoBackButtonProps {
    onClick: () => void;
}

export default function GoBackButton({ onClick }: GoBackButtonProps): JSX.Element {
    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
            <Box
                onClick={onClick}
                sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    fontWeight: 600,
                    fontSize: '14px',
                    borderRadius: '24px',
                    px: 3,
                    py: 1.5,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    ml: { xs: 2, sm: 6 },
                    justifyContent: 'center',
                    transition: 'background-color 0.2s',
                    '&:hover': { backgroundColor: '#F3F4F6' }
                }}
            >
                Go Back
            </Box>
        </Box>
    );
}
