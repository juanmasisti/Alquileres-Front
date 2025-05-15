import { Component, OnInit, HostListener } from '@angular/core';
import { Menu, NavService } from '../../../services/nav.service';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';

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

  constructor(private navService: NavService, private router: Router) {}

  ngOnInit(): void {
    this.checkViewport();
    this.navService.items.subscribe(items => {
      this.menuItems = items;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
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

}