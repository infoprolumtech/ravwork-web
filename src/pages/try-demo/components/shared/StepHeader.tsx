import type { JSX } from "react";
import { Box, Typography } from "@mui/material";

interface StepHeaderProps {
    title: string;
    subtitle: string;
}

export default function StepHeader({ title, subtitle }: StepHeaderProps): JSX.Element {
    return (
        <Box sx={{ mb: { xs: 2, sm: 6 }, textAlign: 'center' }}>
            <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: '#FFFFFF', fontSize: { xs: '26px', sm: '36px', md: '48px' } }}>
                {title}
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: { xs: '14px', sm: '18px' }, px: { xs: 1, sm: 0 } }}>
                {subtitle}
            </Typography>
        </Box>
    );
}
