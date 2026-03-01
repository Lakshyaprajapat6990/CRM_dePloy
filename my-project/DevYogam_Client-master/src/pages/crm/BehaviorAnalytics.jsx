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
} from "@mui/material";
import {
  Visibility as PageViewIcon,
  TouchApp as ClickIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { getAnalytics, getSessionHistory } from "../../services/BehaviorTrackingAPI";

const StatCard = ({ title, value, icon, color }) => (
  <Card sx={{ height: "100%", borderLeft: `4px solid ${color}` }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" variant="subtitle2">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color={color}>
            {value}
          </Typography>
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

const ActionChip = ({ action }) => {
  const colors = {
    page_view: "#1976d2",
    click: "#ed6c02",
    time_spent: "#2e7d32",
    form_submit: "#9c27b0",
    search: "#00acc1",
    exit: "#d32f2f",
    custom: "#607d8b",
  };
  return (
    <Chip
      label={action}
      size="small"
      sx={{
        backgroundColor: `${colors[action] || "#607d8b"}20`,
        color: colors[action] || "#607d8b",
        fontWeight: "bold",
      }}
    />
  );
};

export default function BehaviorAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionFilter, setSessionFilter] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;
      
      const data = await getAnalytics(params);
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionSearch = async () => {
    if (!sessionFilter) return;
    try {
      const data = await getSessionHistory(sessionFilter);
      // Show session data in a modal or expanded section
      console.log("Session data:", data);
    } catch (err) {
      console.error("Failed to fetch session:", err);
    }
  };

  const exportToCSV = () => {
    if (!analytics) return;
    
    // Create CSV content
    const headers = ["Page", "Views"];
    const rows = analytics.topPages?.map(p => [p._id, p.count]) || [];
    
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `behavior-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
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
          Error loading analytics: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            User Behavior Analytics
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Track user journey from landing to exit
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <TextField
            label="Start Date"
            type="date"
            value={dateRange.startDate}
            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <TextField
            label="End Date"
            type="date"
            value={dateRange.endDate}
            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            size="small"
          />
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sessions"
            value={analytics?.totalSessions || 0}
            icon={<PageViewIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unique Users"
            value={analytics?.uniqueUsers || 0}
            icon={<TrendingUpIcon fontSize="large" />}
            color="#9c27b0"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Page Views"
            value={analytics?.totalPageViews || 0}
            icon={<PageViewIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clicks"
            value={analytics?.actionCounts?.click || 0}
            icon={<ClickIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
      </Grid>

      {/* Action Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Action Breakdown
            </Typography>
            <Box sx={{ mt: 2 }}>
              {Object.entries(analytics?.actionCounts || {}).map(([action, count]) => (
                <Box
                  key={action}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <ActionChip action={action} />
                  <Typography variant="h6" fontWeight="bold">
                    {count}
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
                placeholder="Enter session ID to view journey"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" onClick={handleSessionSearch}>
                Search
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Pages */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Most Visited Pages
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Page Path</TableCell>
                <TableCell align="right">Views</TableCell>
                <TableCell align="right">Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics?.topPages?.map((page, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {page._id}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{page.count}</TableCell>
                  <TableCell align="right">
                    {analytics.totalPageViews
                      ? ((page.count / analytics.totalPageViews) * 100).toFixed(1)
                      : 0}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Funnel Data */}
      {analytics?.funnel && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Funnel
          </Typography>
          <Box sx={{ mt: 2 }}>
            {analytics.funnel.map((step, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">{step.stage}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {step.count} ({step.percentage}%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: "#e0e0e0",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${step.percentage}%`,
                      backgroundColor: ["#1976d2", "#ed6c02", "#2e7d32", "#9c27b0"][index % 4],
                      borderRadius: 4,
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
}
