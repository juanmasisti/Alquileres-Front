import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', '../assets/scss/_variables.scss'],
  standalone: false,
})
export class AppComponent {
  title = 'Alquieres-Front';
}
