# CHLTC Newsletter Backend

This is the backend server for the CHLTC Newsletter application. It is built using Node.js, Express, and various other libraries to handle tasks such as email sending, user authentication, and scheduled tasks.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [License](#license)

## Overview

The backend is responsible for handling the server-side logic of the CHLTC Newsletter system. It provides various endpoints for user authentication, newsletter management, and email notifications. The system is designed with modern JavaScript using ES modules.

### Key Features:
- **Express.js** for routing and server handling.
- **jsonwebtoken** for user authentication.
- **nodemailer** for sending emails.
- **node-cron** for scheduling periodic tasks.
- **bcryptjs** for password hashing.
- **mssql** for interacting with Microsoft SQL Server.