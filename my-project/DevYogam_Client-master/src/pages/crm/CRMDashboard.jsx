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
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  People as PeopleIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Call as CallIcon,
  Email as EmailIcon,
  Note as NoteIcon,
} from "@mui/icons-material";
import { getDashboardStats } from "../../services/CRMAPI";

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card
    sx={{
      height: "100%",
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
      borderLeft: `4px solid ${color}`,
    }}
  >
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

const getInteractionIcon = (type) => {
  switch (type) {
    case "call":
      return <CallIcon fontSize="small" />;
    case "email":
      return <EmailIcon fontSize="small" />;
    default:
      return <NoteIcon fontSize="small" />;
  }
};

export default function CRMDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        CRM Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Overview of your customer relationships
      </Typography>

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

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Interactions
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Total interactions: {stats?.totalInteractions || 0}
            </Typography>
            <List>
              {stats?.recentInteractions?.map((interaction, index) => (
                <React.Fragment key={interaction._id || index}>
                  <ListItem alignItems="flex-start">
                    <Box
                      sx={{
                        mr: 2,
                        p: 1,
                        borderRadius: "50%",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      {getInteractionIcon(interaction.type)}
                    </Box>
                    <ListItemText
                      primary={interaction.subject}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {interaction.contact?.name || "Unknown"}
                          </Typography>
                          {" — "}
                          {interaction.description?.substring(0, 50)}
                          {interaction.description?.length > 50 ? "..." : ""}
                        </>
                      }
                    />
                    <Chip
                      label={interaction.type}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  {index < stats.recentInteractions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {(!stats?.recentInteractions ||
                stats.recentInteractions.length === 0) && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  sx={{ py: 2 }}
                >
                  No recent interactions
                </Typography>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lead Status
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
      </Grid>
    </Container>
  );
}
