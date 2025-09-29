# Admin Panel Documentation

## Overview
The admin panel provides centralized management capabilities for the Coffee Quality Control system. It allows administrators to oversee all aspects of the application including user management, green coffee assessments, roast profiles, and cupping sessions.

## Features

### Dashboard
- System overview with key metrics
- Recent activity feed
- Upcoming tasks and system alerts

### User Management
- View all registered users
- Manage user roles and permissions
- Monitor user activity

### Green Coffee Assessments
- View all green coffee assessments
- Search and filter assessments
- Delete assessments

### Roast Profiles
- View all roast profiles
- Search and filter profiles
- Delete profiles

### Cupping Sessions
- View all cupping sessions
- Search and filter sessions
- Delete sessions

## Access Control
The admin panel is protected by the AdminGuard component which ensures only authorized users can access administrative functions.

## Components

### Admin.tsx
Main admin panel page that orchestrates all functionality and provides tab-based navigation.

### AdminGuard.tsx
Protects the admin panel from unauthorized access.

### AdminDashboard.tsx
Provides an overview of system metrics and recent activity.

### UserManagement.tsx
Manages user accounts and permissions.

## Future Enhancements
- Implement actual user role management in Supabase
- Add create and edit functionality for all entities
- Implement detailed analytics and reporting
- Add export capabilities for data
- Implement audit logging