import { type JSX } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";

interface GrowthEngineProps {
  onFinish: () => void;
}

export default function GrowthEngine({
  onFinish,
}: GrowthEngineProps): JSX.Element {
  const renderUserNode = (size: "small" | "large", opacity: number = 1) => (
    <Box
      sx={{
        width:
          size === "large"
            ? { xs: "36px", sm: "48px" }
            : { xs: "24px", sm: "32px" },
        height:
          size === "large"
            ? { xs: "36px", sm: "48px" }
            : { xs: "24px", sm: "32px" },
        borderRadius: "50%",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #3B82F6",
        opacity,
      }}
    >
      <PersonIcon
        sx={{
          color: "#3B82F6",
          fontSize:
            size === "large"
              ? { xs: "20px", sm: "28px" }
              : { xs: "14px", sm: "18px" },
        }}
      />
    </Box>
  );

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      sx={{
        width: "100%",
        maxWidth: "1000px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        color: "#FFFFFF",
      }}
    >
      {/* Top Tag */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "1px solid rgba(59, 130, 246, 0.5)",
            borderRadius: "20px",
            px: 2,
            py: 0.5,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
          }}
        >
          <Box
            sx={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#3B82F6",
            }}
          />
          <Typography
            sx={{
              color: "#93C5FD",
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.05em",
            }}
          >
            SHARE & GROW
          </Typography>
        </Box>
      </Box>

      {/* Headline Section */}
      <Box sx={{ mb: { xs: 3, sm: 8 }, maxWidth: "600px" }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "32px", sm: "44px", md: "56px" },
            lineHeight: 1.1,
            mb: 3,
          }}
        >
          Your link is a <br />
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            growth engine.
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "#9CA3AF",
            fontSize: { xs: "16px", sm: "20px", md: "22px" },
            lineHeight: 1.5,
          }}
        >
          Every client you share your booking page with becomes a potential
          multiplier for your business.
        </Typography>
      </Box>

      {/* Diagram Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 3, sm: 8 },
          gap: { xs: 2, sm: 4 },
        }}
      >
        {/* Visualizer 1 (Your Link) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: { xs: 2, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src="/assets/landing-page/demo/what your client see.png"
              alt="Booking Page"
              sx={{
                width: { xs: "160px", sm: "200px", md: "240px" },
                height: "auto",
                borderRadius: "16px",
                border: "4px solid #A78BFA",
                boxShadow: "0 0 20px rgba(167, 139, 250, 0.3)",
                mb: 2,
              }}
            />
            <Typography
              sx={{ color: "#A78BFA", fontWeight: 700, fontSize: "15px" }}
            >
              Your Link
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                mb: 2,
              }}
            >
              {renderUserNode("large")}
              <Box
                sx={{
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  border: "1px solid #3B82F6",
                  color: "#60A5FA",
                  px: 1.5,
                  py: 0.25,
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                1x
              </Box>
            </Box>
            <Typography
              sx={{
                color: "#F3F4F6",
                fontSize: { xs: "13px", sm: "15px" },
                textAlign: "center",
                maxWidth: "100px",
              }}
            >
              You share your link
            </Typography>
          </Box>
        </Box>

        <ArrowRightAltIcon
          sx={{
            color: "#3B82F6",
            fontSize: "32px",
            transform: { xs: "rotate(90deg)", md: "none" },
          }}
        />

        {/* Visualizer 2 (5 Clients) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {renderUserNode("small")}
                {renderUserNode("small")}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {renderUserNode("small")}
                {renderUserNode("small")}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {renderUserNode("small")}
              </Box>
            </Box>
            <Box
              sx={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                border: "1px solid #3B82F6",
                color: "#60A5FA",
                px: 1.5,
                py: 0.25,
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              5x
            </Box>
          </Box>
          <Typography
            sx={{
              color: "#F3F4F6",
              fontSize: { xs: "13px", sm: "15px" },
              textAlign: "center",
              maxWidth: "100px",
            }}
          >
            5 clients book & refer
          </Typography>
        </Box>

        <ArrowRightAltIcon
          sx={{
            color: "#3B82F6",
            fontSize: "32px",
            transform: { xs: "rotate(90deg)", md: "none" },
          }}
        />

        {/* Visualizer 3 (20 Clients) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {renderUserNode("small", 0.6)}
                {renderUserNode("small", 0.6)}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {renderUserNode("small", 0.7)}
                {renderUserNode("small", 0.7)}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {renderUserNode("small", 0.8)}
                {renderUserNode("small", 0.8)}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {renderUserNode("small", 0.9)}
                {renderUserNode("small", 0.9)}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                {renderUserNode("small")}
                {renderUserNode("small")}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                {renderUserNode("small")}
              </Box>
            </Box>
            <Box
              sx={{
                backgroundColor: "rgba(167, 139, 250, 0.2)",
                border: "1px solid #A78BFA",
                color: "#C4B5FD",
                px: 1.5,
                py: 0.25,
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              20x
            </Box>
          </Box>
          <Typography
            sx={{
              color: "#F3F4F6",
              fontSize: { xs: "13px", sm: "15px" },
              textAlign: "center",
              maxWidth: "120px",
            }}
          >
            20 people know your name
          </Typography>
        </Box>
      </Box>

      {/* Down Arrow separator */}
      <Box
        sx={{ display: "flex", justifyContent: "center", mb: { xs: 2, sm: 6 } }}
      >
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid #A78BFA",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowDownwardIcon sx={{ color: "#A78BFA" }} />
        </Box>
      </Box>

      {/* Final Conversion Card */}
      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "center", pb: 4 }}
      >
        <Paper
          elevation={24}
          sx={{
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "#0F172A",
            borderRadius: "24px",
            overflow: "hidden",
            position: "relative",
            p: { xs: 2, sm: 4, md: 6 },
            border: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.2) 0%, transparent 60%)",
              pointerEvents: "none",
            },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "24px", sm: "32px", md: "40px" },
              color: "#FFFFFF",
              mb: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            Start your 3-day free trial
          </Typography>
          <Typography
            sx={{
              color: "#9CA3AF",
              fontSize: { xs: "14px", sm: "16px", md: "20px" },
              mb: { xs: 3, sm: 5 },
              position: "relative",
              zIndex: 1,
            }}
          >
            Full access to all features —{" "}
            <Box component="span" sx={{ color: "#6B7280" }}>
              only $29/mo after. Cancel anytime.
            </Box>
          </Typography>

          <Button
            onClick={onFinish}
            variant="contained"
            sx={{
              backgroundColor: "#1E1B4B",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: { xs: "14px", sm: "16px" },
              letterSpacing: "0.05em",
              borderRadius: "12px",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              px: { xs: 3, sm: 5 },
              py: 1.5,
              boxShadow: "0 4px 14px rgba(167, 139, 250, 0.2)",
              transition: "all 0.2s",
              position: "relative",
              zIndex: 1,
              "&:hover": {
                backgroundColor: "#312E81",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(167, 139, 250, 0.4)",
              },
            }}
          >
            SIGN UP TODAY
          </Button>

          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 4 },
              mt: { xs: 2, sm: 5 },
              position: "relative",
              zIndex: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {["One job pays for it", "Cancel in one click"].map((text) => (
              <Box
                key={text}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CheckIcon sx={{ color: "#3B82F6", fontSize: "18px" }} />
                <Typography
                  sx={{
                    color: "#9CA3AF",
                    fontSize: { xs: "13px", sm: "15px" },
                  }}
                >
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
