import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (user && user.role === 'ADMIN') {
    return true;
  }
  Swal.fire({
    icon: 'error',
    title: 'Access Denied',
    text: 'Admin privileges required.',
    confirmButtonColor: '#ef4444'
  });
  router.navigate(['/admin/login']);
  return false;
};