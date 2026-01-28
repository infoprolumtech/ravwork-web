// Landing Page Design System and Shared Styles

export const colors = {
  primaryBg: '#0F172A',
  secondaryBg: '#1E293B',
  cardBg: 'rgba(30, 41, 59, 0.5)',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  accentDark: '#2563EB',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  border: '#334155',
  gradientStart: '#3B82F6',
  gradientEnd: '#8B5CF6',
  secondary: "#10161D"
};

export const spacing = {
  sectionPadding: { xs: '60px 0', md: '100px 0' },
  containerMaxWidth: '1200px',
  gridGap: { xs: '24px', md: '32px' },
  cardPadding: { xs: '24px', md: '32px' },
};

// Glassmorphism effect
export const glassmorphism = {
  background: 'rgba(30, 41, 59, 0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
};

// Card styles
export const cardStyle = {
  background: colors.cardBg,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
  padding: spacing.cardPadding,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px rgba(59, 130, 246, 0.2)`,
    borderColor: colors.accent,
  },
};

// Button styles
export const primaryButton = {
  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
  color: colors.textPrimary,
  padding: '14px 32px',
  border: `0.5px solid ${colors.border}`,

  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none' as const,
  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 30px rgba(59, 130, 246, 0.5)',
    transform: 'translateY(-2px)',
    borderColor: colors.accent,


  },
};

export const secondaryButton = {
  background: 'transparent',
  color: colors.textPrimary,
  padding: '14px 32px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none' as const,
  border: `2px solid ${colors.accent}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'rgba(59, 130, 246, 0.1)',
    borderColor: colors.accentLight,
  },
};

// Typography styles
export const headlineStyle = {
  fontSize: { xs: '32px', sm: '42px', md: '48px', lg: '56px' },
  fontWeight: 700,
  color: colors.textPrimary,
  lineHeight: 1.2,
  mb: 2,
};

export const subheadlineStyle = {
  fontSize: { xs: '18px', sm: '20px', md: '22px' },
  fontWeight: 400,
  color: colors.textSecondary,
  lineHeight: 1.6,
  mb: 4,
};

export const sectionTitleStyle = {
  fontSize: { xs: '28px', sm: '34px', md: '40px' },
  fontWeight: 700,
  color: colors.textPrimary,
  lineHeight: 1.3,
  mb: 2,
  textAlign: 'center' as const,
};

// Gradient text effect
export const gradientText = {
  background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.gradientEnd} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// Container styles
export const containerStyle = {
  maxWidth: spacing.containerMaxWidth,
  margin: '0 auto',
  padding: { xs: '0 20px', sm: '0 32px', md: '0 48px' },
};

// Animation keyframes (for use with MUI's keyframes)
export const fadeInUp = {
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

export const fadeIn = {
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
};

export const float = {
  '@keyframes float': {
    '0%, 100%': {
      transform: 'translateY(0)',
    },
    '50%': {
      transform: 'translateY(-20px)',
    },
  },
};
