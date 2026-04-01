import { type JSX } from "react";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { sectionTitleStyle } from "../styles";

const problems = [
  {
    text: "Clients DM you, you reply hours later — and they already booked someone else",
    icon: "/assets/icons/message-icon.svg",
  },
  {
    text: "You're answering the same questions 10 times a day",
    icon: "/assets/icons/questionmark-icon.svg",
  },
  {
    text: "Hard to look professional without a website?",
    icon: "/assets/icons/professional-icon.svg",
  },
  {
    text: "You have no idea how many leads you've lost this month",
    icon: "/assets/icons/leads-icon.svg",
  },
];

export default function ProblemsSection(): JSX.Element {
  return (
    <Box
      sx={{
        background: "#000000",
        padding: { xs: "10px 0", md: "70px 0" },
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{
            ...sectionTitleStyle,
            mb: 6,
            fontSize: { xs: "32px", md: "44px" },
            color: "#FFFFFF",
            fontWeight: 500,
          }}
        >
          Every Day Without This Is  <br />Money Left Behind.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            alignItems: "center",
          }}
        >
          {problems.map((problem, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              sx={{
                background: "rgba(15, 23, 42, 0.6)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                borderRadius: "24px",
                padding: { xs: "20px", md: "24px 32px" },
                display: "flex",
                alignItems: "center",
                gap: 3,
                width: "100%",
                maxWidth: "700px",
                transition:
                  "background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease", // Keeping hover transition separte from entrance
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                  boxShadow: "0 10px 30px rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563EB, #1D4ED8)", // 👈 blue gradient
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Box
                  component="img"
                  src={problem.icon}
                  alt=""
                  sx={{
                    width: 24,
                    height: 24,
                    objectFit: "contain",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontSize: { xs: "16px", md: "20px" },
                  fontWeight: 500,
                  textAlign: "left",
                }}
              >
                {problem.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
