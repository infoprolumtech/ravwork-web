export const textFieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        '& fieldset': { borderColor: '#E5E7EB' },
        '&:hover fieldset': { borderColor: '#D1D5DB' },
        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '1px' },
        color: '#111827',
        fontWeight: 500
    }
};

export const textFieldSxGray = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        '& fieldset': { borderColor: '#E5E7EB' },
        '&:hover fieldset': { borderColor: '#D1D5DB' },
        '&.Mui-focused fieldset': { borderColor: '#3B82F6', borderWidth: '1px' },
        color: '#9CA3AF',
        fontSize: '14px'
    }
};

export const greenIconBadgeSx = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#10B981'
};

export const greenBarSx = {
    position: 'absolute' as const,
    left: { xs: -24, sm: -40 },
    top: 0,
    bottom: 0,
    width: '4px',
    backgroundColor: '#10B981',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px'
};
