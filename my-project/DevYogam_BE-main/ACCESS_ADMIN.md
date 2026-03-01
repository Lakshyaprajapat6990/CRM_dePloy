# CRM Admin Panel - Complete Access Guide

## Overview
The CRM Admin Panel allows you to:
- View all customer interactions
- Track which social media/platform users came from (Facebook, Instagram, Google, WhatsApp, etc.)
- See user journeys (what pages they visited)
- Monitor lead sources and conversion rates

## How to Access the Admin Panel

### Step 1: Login as Admin
1. Go to your website login page
2. Login with admin credentials
3. **Important**: Your user account must have `role: "admin"` in the database

### Step 2: Navigate to Admin CRM Dashboard
Once logged in as admin, go to:
```
http://localhost:3000/admin-crm
```

Or you can also access these routes (admin only):
- `/crm/dashboard` - Basic CRM Dashboard
- `/crm/contacts` - View all contacts
- `/crm/analytics` - Behavior analytics

### If Access is Denied
- Make sure you're logged in
- Check that your user has `role: "admin"` in the database
- If you need to create an admin user, update your user document in MongoDB

## UTM Parameters & Social Media Tracking

### How It Works
When users visit your website with UTM parameters, the system automatically tracks:

| UTM Parameter | Example Value | Tracks |
|--------------|---------------|--------|
| utm_source | facebook, instagram, google | Which platform they came from |
| utm_medium | cpc, social, email | Marketing medium |
| utm_campaign | summer_pooja_2024 | Campaign name |
| utm_term | pooja+booking | Search term |
| utm_content | banner_ad | Ad content |

### Example Links to Test

```
html
<!-- Facebook Ad -->
https://yourwebsite.com/?utm_source=facebook&utm_medium=social&utm_campaign=pooja_2024

<!-- Instagram Post -->
https://yourwebsite.com/?utm_source=instagram&utm_medium=social&utm_campaign=pooja_2024

<!-- Google Ads -->
https://yourwebsite.com/?utm_source=google&utm_medium=cpc&utm_campaign=pooja_2024

<!-- WhatsApp Share -->
https://yourwebsite.com/?utm_source=whatsapp&utm_medium=referral
```

## Features of Admin CRM Dashboard

### 1. Overview Tab
- Total contacts count
- New leads
- Interested leads
- Converted customers
- Recent interactions

### 2. Source Analytics Tab
- Sessions grouped by social media platform (Facebook, Instagram, Google, WhatsApp, etc.)
- Conversions by source (form submits, phone clicks, WhatsApp clicks)
- UTM campaign performance

### 3. Lead Sources Tab
- Breakdown of contacts by their original source
- Shows which marketing channel brings the most leads

### 4. User Journey Search
- Enter a session ID to see:
  - Entry page (first page visited)
  - Source/platform
  - UTM parameters used
  - All pages visited in order
  - Time spent on each page

## Auto-Contact Creation

The system automatically creates CRM contacts when:
1. User clicks on phone number
2. User clicks on WhatsApp
3. User submits a form
4. User registers/logs in
5. User provides contact information

These contacts are linked with their source information (UTM params, social platform).

## API Endpoints (Admin Only)

All these endpoints require admin authentication:

```
GET  /api/behavior/source-analytics     - Get source analytics
GET  /api/behavior/journey/full/:sessionId - Get full user journey
GET  /api/crm/dashboard/stats           - Get CRM stats
GET  /api/crm/contacts                 - List all contacts
GET  /api/crm/contacts/:id             - Get contact by ID
PUT  /api/crm/contacts/:id             - Update contact
```

## Testing the Tracking

1. **Start the backend server:**
```
bash
cd DevYogam_BE-main
npm start
```

2. **Start the frontend:**
```
bash
cd DevYogam_Client-master
npm start
```

3. **Open an incognito window** and visit with UTM parameters:
```
http://localhost:3000/?utm_source=facebook&utm_medium=social&utm_campaign=test_campaign
```

4. **Browse a few pages** on the website

5. **Login as admin** and go to `/admin-crm`

6. **View the analytics** - you should see:
   - Sessions by source (Facebook)
   - Contact created with source "social_media"

## Database Collections

The system uses these collections:
- `userbehaviors` - Stores all user interactions with UTM data
- `crmcontacts` - Stores contact information with source
- `crminteractions` - Stores interactions (calls, emails, notes)

## Project Structure

### Backend Files Updated:
- `DevYogam_BE-main/services/userBehaviorService.js` - Source analytics, auto-contact creation
- `DevYogam_BE-main/routes/userBehaviorRoutes.js` - New analytics endpoints
- `DevYogam_BE-main/models/UserBehavior.js` - UTM fields

### Frontend Files Created/Updated:
- `DevYogam_Client-master/src/utils/utmTracker.js` - UTM parameter capture
- `DevYogam_Client-master/src/services/BehaviorTrackingAPI.jsx` - UTM tracking
- `DevYogam_Client-master/src/pages/crm/AdminCRMDashboard.jsx` - Admin dashboard
- `DevYogam_Client-master/src/routes/PublicRoutes.jsx` - Admin route added
- `DevYogam_Client-master/src/App.jsx` - UTM initialization

## Troubleshooting

### Can't access CRM?
- Make sure you're logged in as admin
- Check that your user has `role: "admin"` in MongoDB

### Not seeing source data?
- UTM parameters are case-sensitive (use lowercase)
- Make sure URLs have `utm_source=` (not `utmSource=`)
- Clear browser session storage and try again

### Questions?
Check the console for any errors and verify:
1. Backend is running on port 5000
2. Frontend is running on port 3000
3. MongoDB is connected
