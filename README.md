# Apartment Management Web Application (ApartmentWebApp)

Full-stack Apartment & Society Management System built with **Spring Boot** and **Angular 18**.

## Architecture Overview

- **Backend (`ProjectBackend/`)**:
  - Spring Boot 3.3.4 (Java 21)
  - Spring Data JPA + Hibernate
  - MySQL Database (`apartmentdb`)
  - RESTful APIs with plain-text credentials for dev/demo

- **Frontend (`ProjectFrontend/`)**:
  - Angular 18 (Standalone Components)
  - Bootstrap 5 & Bootstrap Icons
  - SweetAlert2 for notifications
  - Layouts: Guest, Admin (fixed sidebar/topbar with scrollable content), Resident, Guard

## Features

1. **Admin Panel**:
   - Dashboard with stats & metrics
   - Flat Management (Floor, Flat Number, 1BHK/2BHK/3BHK/Penthouse, Occupied/Available)
   - Resident Management with 1-to-1 Flat Allocation protection
   - Security Guards Management
   - Maintenance Generation & Tracking
   - Payments Record & Statuses
   - Complaints Resolution & Follow-up
   - Society Notices & Broadcasts
   - Visitor Logs (Real-time Check-In & Check-Out with full timestamps)
   - Parking Slot Allocations
   - Society Events & Celebrations
   - Maintenance Staff Management
   - Expense Tracking
   - Analytical Reports & Summary
   - Administrator Accounts Management

2. **Resident Portal**:
   - Personal Dashboard & Flat Details
   - Self-service Profile editing (Name, Email, Phone, Password)
   - Maintenance Dues & Online Payment
   - Complaints submission & Tracking
   - Visitor History
   - Society Notices & Events
   - Parking Slot view

3. **Security Guard Portal**:
   - Gatehouse Duty Dashboard
   - Visitor Entry & Exit Logging with automated timestamps
   - Guard Duty Profile

## Default Credentials

- **Admin**:
  - Login: `/admin/login` (or Alt + A shortcut from Guest home)
  - Username: `admin` | Password: `admin`
- **Resident**:
  - Login: `/login` (Role: Resident)
  - Username: `john_doe` | Password: `password123`
- **Guard**:
  - Login: `/login` (Role: Guard)
  - Username: `guard_ramesh` | Password: `guard123`

## Running the Application

### 1. Database Setup
Create MySQL database `apartmentdb`:
```sql
CREATE DATABASE IF NOT EXISTS apartmentdb;
```

### 2. Backend (Spring Boot)
```bash
cd ProjectBackend
mvn spring-boot:run
```
Runs at `http://localhost:8080`.

### 3. Frontend (Angular)
```bash
cd ProjectFrontend
npm install
ng serve
```
Runs at `http://localhost:4200`.
