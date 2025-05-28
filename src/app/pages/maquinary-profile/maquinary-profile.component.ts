import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaquinariaService } from '../../services/maquinaria.service';
import { Maquinaria } from '../../models/maquinaria.model';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MercadoPagoService } from 'src/app/services/mercadoPago.service';
import { PagoModel } from 'src/app/models/pago.model';

declare var MercadoPago: any;

@Component({
  selector: 'app-maquinary-profile',
  templateUrl: './maquinary-profile.component.html',
  styleUrls: ['./maquinary-profile.component.scss'],
  imports: [NavbarComponent, FooterComponent, CommonModule, FormsModule],
  standalone: true,
})
export class MaquinaryProfileComponent implements OnInit {
  maquinaria: Maquinaria | null = null;
  isLoading = true;
  error: string | null = null;
  mostrarModal = false;
  mostrarPagar = false;
  fechaSeleccionada: any = null;
  isAdmin =
    sessionStorage.getItem('rol') === 'admin' ||
    sessionStorage.getItem('rol') === 'empleado';

  private bricksBuilder: any = null;
  private mp: any = null;

  constructor(
    private route: ActivatedRoute,
    private maquinariaService: MaquinariaService,
    private mercadoPagoService: MercadoPagoService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.initMercadoPago();

    if (id) {
      this.loadMaquinaria(+id);
    } else {
      this.error = 'No se encontró el ID de la maquinaria';
      this.isLoading = false;
    }
  }

  private initMercadoPago() {
    const publicKey = environment.mercadoPagoPublicKey;
    this.mp = new MercadoPago(publicKey);
  }

  private initBricks() {
    this.bricksBuilder = this.mp.bricks();
  }

  private renderWalletBrick = async (
    bricksBuilder: any,
    preferenceId: string
  ) => {
    await bricksBuilder.create('wallet', 'walletBrick_container', {
      initialization: {
        preferenceId: preferenceId,
        redirectMode: 'self',
      },
      customization: {
        theme: 'default',
        customStyle: {
          borderRadius: '10px',
          verticalPadding: '10px',
          horizontalPadding: '10px',
          hideValueProp: true,
        },
      },
    });
  };

  private loadMaquinaria(id: number): void {
    this.maquinariaService.getById(id).subscribe({
      next: (data) => {
        this.maquinaria = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la maquinaria';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  abrirModal() {
    this.mostrarModal = true;
    this.showMercadoPago();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.mostrarPagar = false;
  }

  showMercadoPago() {
    // Cuando haya seleccionado las fechas, se ejecuta esta funcion
    // si las cambia, se oculta y se vuelve a ejecutar esta funcion

    if (!this.maquinaria) return;

    const item: PagoModel = {
      id: this.maquinaria.id,
      days: 3, // mas facil xq aun no se concreto la reserva, eso iria x otra ruta
      // Tambien depende si se concreto o no el pago el registro de la reserva
    };

    this.mercadoPagoService.getPreferenceId(item).subscribe({
      next: (res) => {
        this.initBricks();
        this.renderWalletBrick(this.bricksBuilder, res.id);
        this.mostrarPagar = true;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'disponible':
        return 'available';
      case 'alquilada':
        return 'rented';
      case 'mantenimiento':
        return 'maintenance';
      default:
        return '';
    }
  }
}
