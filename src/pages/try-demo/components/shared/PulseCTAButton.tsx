import type { JSX } from "react";
import { Button } from "@mui/material";

interface PulseCTAButtonProps {
    onClick: () => void;
    label: string;
    showPulse?: boolean;
}

export default function PulseCTAButton({ onClick, label, showPulse = false }: PulseCTAButtonProps): JSX.Element {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '24px',
                px: 4,
                py: 1,
                boxShadow: showPulse ? '0 0 0 4px rgba(59, 130, 246, 0.4)' : 'none',
                transition: 'background-color 0.3s ease',
                animation: showPulse ? 'pulseBtn 2s infinite' : 'none',
                '@keyframes pulseBtn': {
                    '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)' }
                },
                '&:hover': { backgroundColor: '#1F2937' }
            }}
        >
            {label}
        </Button>
    );
}
