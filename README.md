This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
# Secure File Sharing Platform (Frontend)

A modern, secure file sharing platform built with Next.js, TypeScript, and Redux Toolkit. This application allows users to securely upload, share, and manage files with advanced features like Two-Factor Authentication and role-based access control.

## Features

### Authentication & Security
- 🔐 User Registration and Login
- 🔒 Two-Factor Authentication (Email-based)
- 🛡️ Role-based Access Control (Admin/User)
- 🚪 Automatic Session Management

### File Management
- 📤 File Upload with Progress Tracking
- 📂 File Organization and Listing
- 🗑️ File Deletion
- 📥 Secure File Downloads

### File Sharing
- 🔗 Public and Private File Sharing
- ⏱️ Time-limited Share Links
- 📋 Permission-based Access (View/Download)
- 👥 Share with Multiple Users

### Admin Features
- 👀 View All Shared Files
- 🚫 Revoke Any Share Access
- 👤 User Role Management
- 📊 System Overview

## Screenshots

### Dashboard
![Dashboard](/public/adminDashboard.png)
- File listing with actions
- Upload functionality
- Quick access to shared files

![ Guest Dashboard](/public/guestDashboard.png.png)
- File listing with actions
- Upload functionality
- Quick access to shared files

### File Sharing
![File Sharing](/public/sharedFileTab.png)
- Share dialog with multiple options
- Permission settings
- Expiration configuration

### Admin Panel
![Admin Panel](/public/adminsettings.png)
- All shares overview
- User management
- System settings

### MFA Setup
![MFA - setup](/public/MFA-setup.png)
- 6 digit verification code
- two factor authentication by email

### Authentication
![Register Page](/public/register.png)
- Clean, modern authentication UI
- Email-based registration
- Form validation
- Error handling

### Authentication
![Login Page](/public/login.png)
- Clean, modern authentication UI
- Email-based registration
- Form validation
- Error handling

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API running ([Backend Repository](https://github.com/kartikey-shivam/abnormalsecurity-backend))

### Installation

1. Clone the repository:
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# abnormalsecurity-frontend

## Backend Repository

The backend for this project is available at: [Secure File Sharing Backend](https://github.com/kartikey-shivam/abnormalsecurity-backend)
