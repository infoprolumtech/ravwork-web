import type { JSX } from "react";
import { Box } from "@mui/material";

type Direction = 'down' | 'left' | 'up';

interface HandHintProps {
    show: boolean;
    direction?: Direction;
    sx?: object;
}

const keyframeMap: Record<Direction, object> = {
    down: {
        '@keyframes bounceHand': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(10px)' },
        },
    },
    up: {
        '@keyframes bounceHand': {
            '0%, 100%': { transform: 'translateY(0) rotate(180deg)' },
            '50%': { transform: 'translateY(-10px) rotate(180deg)' },
        },
    },
    left: {
        '@keyframes bounceHand': {
            '0%, 100%': { transform: 'translateX(0) rotate(90deg)' },
            '50%': { transform: 'translateX(-10px) rotate(90deg)' },
        },
    },
};

const rotationMap: Record<Direction, string | undefined> = {
    down: undefined,
    up: 'rotate(180deg)',
    left: 'rotate(90deg)',
};

export default function HandHint({ show, direction = 'up', sx = {} }: HandHintProps): JSX.Element | null {
    if (!show) return null;

    return (
        <Box
            component="img"
            src="/assets/landing-page/demo/hand.png"
            alt="Click hint"
            sx={{
                position: 'absolute',
                width: { xs: '32px', sm: '40px' },
                height: 'auto',
                animation: 'bounceHand 1.5s infinite',
                ...keyframeMap[direction],
                transform: rotationMap[direction],
                zIndex: 10,
                pointerEvents: 'none',
                ...sx,
            }}
        />
    );
}
