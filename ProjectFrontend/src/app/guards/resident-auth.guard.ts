import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const residentAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (user && user.role === 'RESIDENT') {
    return true;
  }
  Swal.fire({
    icon: 'warning',
    title: 'Access Restricted',
    text: 'Please log in as a Resident.',
    confirmButtonColor: '#2563eb'
  });
  router.navigate(['/login'], { queryParams: { role: 'resident' } });
  return false;
};