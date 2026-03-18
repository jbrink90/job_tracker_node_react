import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import {
  ArrowForward,
  AccessTime,
  Edit,
  TrackChanges,
} from "@mui/icons-material";
import { PageFooter } from "../../components";

export default function Home() {
  const navigate = useNavigate();
  const theme = useTheme();

  const panels = [
    {
      title: "Update with Markdown",
      description:
        "Easily update your job postings with Markdown for rich formatting without the hassle.",
      icon: <Edit sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
    },
    {
      title: "Track Status",
      description:
        "Keep tabs on every job posting's progress, deadlines, and changes in one place.",
      icon: (
        <TrackChanges
          sx={{ fontSize: 40, color: theme.palette.primary.main }}
        />
      ),
    },
    {
      title: "Magic Login",
      description:
        "No passwords required. Securely login using just your email — hassle-free and safe.",
      icon: (
        <AccessTime sx={{ fontSize: 40, color: theme.palette.primary.main }} />
      ),
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <section className="relative min-h-screen hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AppBar
            position="fixed"
            elevation={0}
            sx={{
              backdropFilter: "blur(12px)",
              bgcolor:
                theme.palette.mode === "dark"
                  ? "rgba(0,0,0,0.8)"
                  : "rgba(255,255,255,0.8)",
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="/search.png"
                    width={24}
                    height={24}
                    alt="JobTrackr Logo"
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "text.primary" }}
                >
                  JobTrackr
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  color="inherit"
                  sx={{ color: "text.primary" }}
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => navigate("/login")}
                >
                  Get Started
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
        </motion.div>

        <Container sx={{ position: "relative", zIndex: 10, pt: 16, pb: 10 }}>
          <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center", pt: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", md: "3.5rem", lg: "4.2rem" },
                  lineHeight: 1.1,
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Keep Track of Your{" "}
                <span
                  style={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Dream Gig
                </span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "text.secondary",
                  maxWidth: 600,
                  mx: "auto",
                  mb: 5,
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                Your sidekick for tracking applications and landing that dream
                gig with ease.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  disableElevation
                  endIcon={<ArrowForward />}
                  onClick={() => navigate("/dashboard")}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    px: 4,
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{ px: 4, borderWidth: 2, "&:hover": { borderWidth: 2 } }}
                >
                  See How It Works
                </Button>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 3 }}
              >
                ✨ Install as an app on any device • No credit card required
              </Typography>
            </motion.div>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box sx={{ mt: 8, maxWidth: 1000, mx: "auto" }}>
              <Paper
                elevation={8}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? theme.palette.grey[900]
                        : theme.palette.grey[100],
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 0.75 }}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "error.main",
                        opacity: 0.6,
                      }}
                    />
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "warning.main",
                        opacity: 0.6,
                      }}
                    />
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        opacity: 0.6,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      Your Job Applications
                    </Typography>
                  </Box>
                </Box>

                <TableContainer>
                  <Table sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor: "action.hover",
                          cursor: "pointer",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            theme.palette.action.selected;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            theme.palette.action.hover;
                        }}
                      >
                        <TableCell
                          sx={{
                            p: 1,
                            maxWidth: 10,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            width: { xs: "25%", md: "20%" },
                          }}
                        >
                          Company
                        </TableCell>
                        <TableCell
                          sx={{
                            p: 1,
                            maxWidth: 10,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            width: { xs: "25%", md: "15%" },
                          }}
                        >
                          Job Title
                        </TableCell>
                        <TableCell
                          sx={{
                            p: 1,
                            maxWidth: 10,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            width: { xs: "25%", md: "20%" },
                          }}
                        >
                          Location
                        </TableCell>
                        <TableCell
                          sx={{
                            p: 1,
                            maxWidth: 10,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            width: { xs: "25%", md: "15%" },
                          }}
                        >
                          Status
                        </TableCell>
                        <TableCell
                          sx={{
                            p: 1,
                            maxWidth: 10,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            display: { xs: "none", md: "table-cell" },
                            width: { md: "10%" },
                          }}
                        >
                          Applied
                        </TableCell>
                        <TableCell
                          sx={{
                            p: 1,
                            maxWidth: 10,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            display: { xs: "none", md: "table-cell" },
                            width: { md: "10%" },
                          }}
                        >
                          Updated
                        </TableCell>
                        <TableCell
                          sx={{
                            p: 1,
                            maxWidth: 10,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontSize: "0.75rem",
                            display: { xs: "none", md: "table-cell" },
                            width: { md: "10%" },
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          company: "TechCorp",
                          jobTitle: "Senior Developer",
                          location: "San Francisco, CA",
                          status: "Applied",
                          statusColor: "primary",
                          applied: "Jan 15",
                          updated: "Jan 18",
                        },
                        {
                          company: "StartupXYZ",
                          jobTitle: "Frontend Lead",
                          location: "Remote",
                          status: "Interview Scheduled",
                          statusColor: "warning",
                          applied: "Jan 10",
                          updated: "Jan 22",
                        },
                        {
                          company: "BigTech Inc",
                          jobTitle: "Full Stack Engineer",
                          location: "New York, NY",
                          status: "Offer Received",
                          statusColor: "success",
                          applied: "Jan 5",
                          updated: "Jan 24",
                        },
                      ].map((job, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                          style={{
                            display: "table-row",
                            cursor: "pointer",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              theme.palette.action.hover;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <TableCell
                            sx={{
                              p: 1,
                              fontWeight: 500,
                              maxWidth: 10,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                              width: { xs: "25%", md: "20%" },
                            }}
                          >
                            {job.company}
                          </TableCell>
                          <TableCell
                            sx={{
                              p: 1,
                              color: "text.secondary",
                              maxWidth: 10,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                              width: { xs: "25%", md: "15%" },
                            }}
                          >
                            {job.jobTitle}
                          </TableCell>
                          <TableCell
                            sx={{
                              p: 1,
                              color: "text.secondary",
                              maxWidth: 10,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                              width: { xs: "25%", md: "20%" },
                            }}
                          >
                            {job.location}
                          </TableCell>
                          <TableCell
                            sx={{
                              p: 1,
                              maxWidth: 10,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                              width: { xs: "25%", md: "15%" },
                            }}
                          >
                            <Chip
                              label={job.status}
                              color={
                                job.statusColor as
                                  | "default"
                                  | "primary"
                                  | "warning"
                                  | "success"
                                  | "secondary"
                                  | "error"
                                  | "info"
                              }
                              size="small"
                              sx={{ fontWeight: 500, fontSize: "0.7rem" }}
                            />
                          </TableCell>
                          <TableCell
                            sx={{
                              p: 1,
                              maxWidth: 10,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                              display: { xs: "none", md: "table-cell" },
                              width: { md: "10%" },
                            }}
                          >
                            {job.applied}
                          </TableCell>
                          <TableCell
                            sx={{
                              p: 1,
                              maxWidth: 10,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                              display: { xs: "none", md: "table-cell" },
                              width: { md: "10%" },
                            }}
                          >
                            {job.updated}
                          </TableCell>
                          <TableCell
                            sx={{
                              p: 1,
                              maxWidth: 10,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "0.75rem",
                              display: { xs: "none", md: "table-cell" },
                              width: { md: "10%" },
                            }}
                          >
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                sx={{
                                  minWidth: 0,
                                  px: 1,
                                  py: 0.25,
                                  fontSize: "0.65rem",
                                }}
                              >
                                Edit
                              </Button>
                            </Box>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </motion.div>
        </Container>
      </section>

      <Box
        sx={{
          py: 12,
          bgcolor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{
                textAlign: "center",
                mb: 8,
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Everything You Need to Track Your Job Search
            </Typography>
          </motion.div>

          <Grid container spacing={4} sx={{ justifyContent: "center" }}>
            {panels.map((panel, index) => (
              <motion.div
                key={panel.title}
                initial={{ opacity: 0, y: 30, x: -80 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Paper
                  sx={{
                    flex: "1 1 300px",
                    maxWidth: 360,
                    minWidth: 280,
                    p: 4,
                    textAlign: "center",
                    borderRadius: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[8],
                    },
                    backgroundColor: theme.palette.background.paper,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ mb: 3 }}>{panel.icon}</Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {panel.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", lineHeight: 1.6 }}
                  >
                    {panel.description}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Box>

      <PageFooter />
    </Box>
  );
}
