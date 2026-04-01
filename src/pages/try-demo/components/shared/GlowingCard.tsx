import type { JSX, ReactNode } from "react";
import { Box, Paper } from "@mui/material";

interface GlowingCardProps {
    children: ReactNode;
    overflow?: string;
    paperSx?: object;
}

export default function GlowingCard({ children, overflow = 'visible', paperSx = {} }: GlowingCardProps): JSX.Element {
    return (
        <Box sx={{
            width: '90%',
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: '-20px',
                left: '-20px',
                right: '-20px',
                bottom: '-20px',
                background: 'linear-gradient(180deg, rgba(81, 146, 251, 0.6) 0%, rgba(59, 130, 246, 0) 100%)',
//                 background: `
//   linear-gradient(
//     180deg,
//     #1F7BD7 0%,
//     #2853CA 40%,
//     #4691CA 70%,
//     #2853CA 100%
//   )
// `,
                filter: 'blur(50px)',
                zIndex: 0,
                borderRadius: '32px',
                opacity: 0.8,
                 margin: "8px 0",
            }
        }}>
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '24px',
                    overflow,
                    p: { xs: 2, sm: 5 },
                    display: 'flex',
                    flexDirection: 'column',
                    ...paperSx,
                }}
            >
                {children}
            </Paper>
        </Box>
    );
}
