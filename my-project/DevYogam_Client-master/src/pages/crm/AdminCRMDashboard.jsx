import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  People as PeopleIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Google as GoogleIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  getDashboardStats,
  getContactsBySource,
  getContactsByStatus,
} from "../../services/CRMAPI";
import {
  getSourceAnalytics,
  getFullUserJourney,
} from "../../services/BehaviorTrackingAPI";

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: "100%", borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" variant="subtitle2">
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: "50%",
            backgroundColor: `${color}20`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const SourceIcon = ({ source }) => {
  const icons = {
    facebook: <FacebookIcon sx={{ color: "#1877F2" }} />,
    instagram: <InstagramIcon sx={{ color: "#E4405F" }} />,
    google: <GoogleIcon sx={{ color: "#4285F4" }} />,
    whatsapp: <WhatsAppIcon sx={{ color: "#25D366" }} />,
    direct: <PeopleIcon sx={{ color: "#666" }} />,
  };
  return icons[source] || <PeopleIcon sx={{ color: "#666" }} />;
};

export default function AdminCRMDashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [journeyDialog, setJourneyDialog] = useState({ open: false, data: null });
  const [sessionFilter, setSessionFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  // Calculate date range based on filter
  const getDateRange = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case "today":
        return {
          startDate: today.toISOString(),
          endDate: now.toISOString(),
        };
      case "week":
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return {
          startDate: weekAgo.toISOString(),
          endDate: now.toISOString(),
        };
      case "month":
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return {
          startDate: monthAgo.toISOString(),
          endDate: now.toISOString(),
        };
      default:
        return {};
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dateFilter]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const dateRange = getDateRange();
      const [statsData, sourceAnalytics] = await Promise.all([
        getDashboardStats(dateRange),
        getSourceAnalytics(dateRange),
      ]);
      setStats(statsData);
      setSourceData(sourceAnalytics);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setDateFilter(newFilter);
    }
  };

  const handleViewJourney = async (sessionId) => {
    try {
      const journey = await getFullUserJourney(sessionId);
      setJourneyDialog({ open: true, data: journey });
    } catch (err) {
      console.error("Failed to fetch journey:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" align="center">
          Error loading dashboard: {error}
        </Typography>
        <Button onClick={fetchAllData} sx={{ mt: 2 }}>Retry</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            CRM Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track user interactions and social media sources
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <ToggleButtonGroup
            value={dateFilter}
            exclusive
            onChange={handleDateFilterChange}
            size="small"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="today">Today</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
          <Button
            startIcon={<RefreshIcon />}
            onClick={fetchAllData}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Source Analytics" />
        <Tab label="Lead Sources" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Contacts"
                value={stats?.totalContacts || 0}
                icon={<PeopleIcon fontSize="large" />}
                color="#1976d2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="New Leads"
                value={stats?.newContacts || 0}
                icon={<PhoneIcon fontSize="large" />}
                color="#ed6c02"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Interested"
                value={stats?.interestedContacts || 0}
                icon={<TrendingUpIcon fontSize="large" />}
                color="#9c27b0"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Converted"
                value={stats?.convertedContacts || 0}
                icon={<CheckCircleIcon fontSize="large" />}
                color="#2e7d32"
              />
            </Grid>
          </Grid>

          {/* Quick Stats */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Lead Status Breakdown
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {[
                    { label: "New", value: stats?.newContacts || 0, color: "#ed6c02" },
                    { label: "Contacted", value: stats?.contactedContacts || 0, color: "#1976d2" },
                    { label: "Interested", value: stats?.interestedContacts || 0, color: "#9c27b0" },
                    { label: "Converted", value: stats?.convertedContacts || 0, color: "#2e7d32" },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography variant="body1" fontWeight="bold" color={item.color}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Session Search
                </Typography>
                <Box display="flex" gap={2} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Session ID"
                    value={sessionFilter}
                    onChange={(e) => setSessionFilter(e.target.value)}
                    placeholder="Enter session ID"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleViewJourney(sessionFilter)}
                  >
                    View Journey
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          {/* Sessions by Source */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sessions by Social Media Source
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Source</TableCell>
                      <TableCell align="right">Sessions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sourceData?.sessionsBySource?.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <SourceIcon source={item._id} />
                            <Typography textTransform="capitalize">
                              {item._id || "Unknown"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={item.sessions} color="primary" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Conversions by Source */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Conversions by Source
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Source</TableCell>
                      <TableCell align="right">Conversions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sourceData?.conversionsBySource?.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <SourceIcon source={item._id} />
                            <Typography textTransform="capitalize">
                              {item._id || "Unknown"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={item.conversions}
                            color="success"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contacts by Source
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Contacts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sourceData?.contactsBySource?.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <SourceIcon source={item._id} />
                        <Typography textTransform="capitalize">
                          {item._id || "Unknown"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip label={item.count} color="info" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Journey Dialog */}
      <Dialog
        open={journeyDialog.open}
        onClose={() => setJourneyDialog({ open: false, data: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Journey</DialogTitle>
        <DialogContent>
          {journeyDialog.data && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Entry Page:</Typography>
                  <Typography>{journeyDialog.data.entryPage}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Source:</Typography>
                  <Chip
                    label={journeyDialog.data.entrySource}
                    size="small"
                    icon={<SourceIcon source={journeyDialog.data.entrySource} />}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">UTM Source:</Typography>
                  <Typography>{journeyDialog.data.utmSource || "N/A"}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Page Views:</Typography>
                  <Typography>{journeyDialog.data.totalPageViews}</Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" gutterBottom>
                Journey
              </Typography>
              <List>
                {journeyDialog.data.journey?.map((item, index) => (
                  <ListItem key={index}>
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      {index + 1}
                    </Avatar>
                    <ListItemText
                      primary={item.page}
                      secondary={new Date(item.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setJourneyDialog({ open: false, data: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
