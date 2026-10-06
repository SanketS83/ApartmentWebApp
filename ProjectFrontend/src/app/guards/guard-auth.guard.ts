import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import Swal from 'sweetalert2';

export const guardAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (user && user.role === 'GUARD') {
    return true;
  }
  Swal.fire({
    icon: 'warning',
    title: 'Access Restricted',
    text: 'Please log in with Guard credentials.',
    confirmButtonColor: '#0f172a'
  });
  router.navigate(['/login'], { queryParams: { role: 'guard' } });
  return false;
};