import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Menu, NavService } from '../../../services/nav.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  menuItems: Menu[] = [];
  isMobileView = false;
  mobileMenuOpen = false;
  scrolled = false;
  dropdownOpen = false;
  showLogoutModal = false;
  rol!: string | null;
  name!: string | null;

  constructor(
    private navService: NavService,
    private router: Router,
    private authService: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');
    this.checkViewport();
    this.navService.items.subscribe((items) => {
      this.menuItems = items;
    });
    console.log('Token en sesión:', sessionStorage.getItem('token'));
    console.log('Autenticado:', this.isAuthenticated());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownElement =
      this.elementRef.nativeElement.querySelector('.dropdown-menu');
    const profileIcon =
      this.elementRef.nativeElement.querySelector('.profile-icon');

    // Si el dropdown está abierto Y el clic fue fuera del dropdown Y fuera del ícono que lo activa
    if (
      this.dropdownOpen &&
      !dropdownElement.contains(target) &&
      !profileIcon.contains(target)
    ) {
      this.closeDropdown();
    }
  }

  checkViewport() {
    this.isMobileView = window.innerWidth < 992;
    if (!this.isMobileView && this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      document.body.style.overflow = 'auto';
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'auto';
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    document.body.style.overflow = 'auto';
  }

  isActive(path: string): boolean {
    return this.router.isActive(path, true);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  navigate(item: Menu): void {
    if (item.type === 'fragment') {
      this.scrollToFragment(item.path || '');
    }
  }

  private scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      const navbarHeight = 80; // Ajustar según tu navbar
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    setTimeout(() => (this.dropdownOpen = false), 150); // Da tiempo a hacer click
  }

  confirmLogout() {
    this.authService.logout();
    this.closeDropdown();
    this.showLogoutModal = false;
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  openLogoutModal() {
    this.showLogoutModal = true;
    this.closeDropdown();
  }
}
