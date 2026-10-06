import { Routes } from '@angular/router';
import { GuestLayoutComponent } from './layouts/guest-layout/guest-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ResidentLayoutComponent } from './layouts/resident-layout/resident-layout.component';
import { GuardLayoutComponent } from './layouts/guard-layout/guard-layout.component';

import { adminAuthGuard } from './guards/admin-auth.guard';
import { residentAuthGuard } from './guards/resident-auth.guard';
import { guardAuthGuard } from './guards/guard-auth.guard';

import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';

export const routes: Routes = [
  // 1. Guest Panel (Home with apartment image, buttons for guard/resident login, Alt + A shortcut)
  {
    path: '',
    component: GuestLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./components/guest/home/home.component').then(m => m.HomeComponent) },
      { path: 'login', loadComponent: () => import('./components/guest/login/login.component').then(m => m.LoginComponent) },
      { path: 'forgot-password', loadComponent: () => import('./components/guest/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
    ]
  },

  // 2. Admin Login (Separate page without any layout)
  {
    path: 'admin/login',
    component: AdminLoginComponent
  },

  // 3. Admin Panel (Protected by adminAuthGuard)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminAuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'flats', loadComponent: () => import('./components/admin/flats/flats.component').then(m => m.FlatsComponent) },
      { path: 'residents', loadComponent: () => import('./components/admin/residents/residents.component').then(m => m.ResidentsComponent) },
      { path: 'guards', loadComponent: () => import('./components/admin/guards/guards.component').then(m => m.GuardsComponent) },
      { path: 'maintenance', loadComponent: () => import('./components/admin/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
      { path: 'payments', loadComponent: () => import('./components/admin/payments/payments.component').then(m => m.PaymentsComponent) },
      { path: 'complaints', loadComponent: () => import('./components/admin/complaints/complaints.component').then(m => m.ComplaintsComponent) },
      { path: 'notices', loadComponent: () => import('./components/admin/notices/notices.component').then(m => m.NoticesComponent) },
      { path: 'visitors', loadComponent: () => import('./components/admin/visitors/visitors.component').then(m => m.VisitorsComponent) },
      { path: 'parking', loadComponent: () => import('./components/admin/parking/parking.component').then(m => m.ParkingComponent) },
      { path: 'events', loadComponent: () => import('./components/admin/events/events.component').then(m => m.EventsComponent) },
      { path: 'staff', loadComponent: () => import('./components/admin/staff/staff.component').then(m => m.StaffComponent) },
      { path: 'expenses', loadComponent: () => import('./components/admin/expenses/expenses.component').then(m => m.ExpensesComponent) },
      { path: 'reports', loadComponent: () => import('./components/admin/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'admins', loadComponent: () => import('./components/admin/admins/admins.component').then(m => m.AdminsComponent) },
    ]
  },

  // 4. Resident Panel (Protected by residentAuthGuard)
  {
    path: 'resident',
    component: ResidentLayoutComponent,
    canActivate: [residentAuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/resident/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'profile', loadComponent: () => import('./components/resident/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'maintenance', loadComponent: () => import('./components/resident/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
      { path: 'payments', loadComponent: () => import('./components/resident/payments/payments.component').then(m => m.PaymentsComponent) },
      { path: 'complaints', loadComponent: () => import('./components/resident/complaints/complaints.component').then(m => m.ComplaintsComponent) },
      { path: 'visitors', loadComponent: () => import('./components/resident/visitors/visitors.component').then(m => m.VisitorsComponent) },
      { path: 'notices', loadComponent: () => import('./components/resident/notices/notices.component').then(m => m.NoticesComponent) },
      { path: 'events', loadComponent: () => import('./components/resident/events/events.component').then(m => m.EventsComponent) },
      { path: 'parking', loadComponent: () => import('./components/resident/parking/parking.component').then(m => m.ParkingComponent) },
    ]
  },

  // 5. Guard Panel (Protected by guardAuthGuard)
  {
    path: 'guard',
    component: GuardLayoutComponent,
    canActivate: [guardAuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/guard/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'visitors', loadComponent: () => import('./components/guard/visitors/visitors.component').then(m => m.VisitorsComponent) },
      { path: 'profile', loadComponent: () => import('./components/guard/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },

  { path: '**', redirectTo: '' }
];
