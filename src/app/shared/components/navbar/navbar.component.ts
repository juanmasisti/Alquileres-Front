import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Menu, NavService } from '../../../services/nav.service';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Route, Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { filter } from 'rxjs';

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
    private elementRef: ElementRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.rol = sessionStorage.getItem('rol');

    this.userService.getProfile().subscribe({
      next: (user) => {
        this.name = user.nombre;
      },
      error: (err) => {
        console.log('Error al obtener perfil del usuario:', err);
      },
    });

    this.checkViewport();

    this.navService.items.subscribe((items) => {
      // Clonamos el array para no modificar el observable directamente
      let menu = [...items];

      // Agregamos el ítem USUARIOS solo si es admin
      if (this.rol === 'admin') {
        menu.push({
          title: 'USUARIOS',
          path: '/usuarios',
          type: 'link',
          icon: 'fas fa-users-cog',
        });
      }

      this.menuItems = menu;
    });

    console.log('Token en sesión:', sessionStorage.getItem('token'));
    console.log('Autenticado:', this.isAuthenticated());
    console.log('Rol del usuario:', this.rol);
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
      const fragment = item.path || '';
      const currentUrl = this.router.url.split('#')[0];
      const targetUrl = fragment.includes('/') ? fragment.split('#')[0] : '/';

      if (fragment === 'footer') {
        // Contacto está en todas las páginas, no navegamos
        this.scrollToFragment(fragment);
        return;
      }

      if (currentUrl !== targetUrl) {
        this.router.navigate([targetUrl]).then(() => {
          this.scrollOnNavigationEnd(fragment);
        });
      } else {
        this.scrollToFragment(fragment);
      }
    }
  }

  private scrollOnNavigationEnd(fragment: string): void {
    const sub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToFragment(fragment);
        sub.unsubscribe(); // evitamos múltiples suscripciones
      });
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
    sessionStorage.clear();
    this.router.navigate(['']);
    
  }

  cancelLogout() {
    this.showLogoutModal = false;
  }

  openLogoutModal() {
    this.showLogoutModal = true;
    this.closeDropdown();
  }
}
