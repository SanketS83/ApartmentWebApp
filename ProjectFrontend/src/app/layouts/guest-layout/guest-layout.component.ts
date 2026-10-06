import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-guest-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './guest-layout.component.html',
  styleUrl: './guest-layout.component.css'
})
export class GuestLayoutComponent {
  constructor(private router: Router) {}

  @HostListener('window:keydown', ['$event'])
  handleShortcut(event: KeyboardEvent) {
    if (event.altKey && event.key.toLowerCase() === 'a') {
      console.log('Shortcut triggered');
      this.router.navigate(['/admin/login']);
    }
  }

  goToResidentLogin(): void {
    this.router.navigate(['/login'], { queryParams: { role: 'resident' } });
  }

  goToGuardLogin(): void {
    this.router.navigate(['/login'], { queryParams: { role: 'guard' } });
  }
}