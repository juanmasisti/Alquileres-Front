import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { Chart, registerables, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables); // Registra todos los componentes de chart.js existentes

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent]
})
export class StatisticsComponent implements OnInit, AfterViewInit {

  // ViewChild obtiene referencia al elemento canvas en el template una vez renderizado
  @ViewChild('clientesChart') clientesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('alquileresChart') alquileresChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosChart') ingresosChart!: ElementRef<HTMLCanvasElement>;

  constructor(private statsService: StatsService) {}

  ngOnInit(): void {
    // No hacemos nada aquí con los gráficos ya que los ViewChilds no están disponibles aún
  }

  ngAfterViewInit(): void {
    // Usamos AfterViewInit porque aquí ya tenemos acceso a los elementos ViewChild
    this.cargarClientes();
    this.cargarAlquileres();
    this.cargarIngresos();
  }

  /**
   * 🔧 Función general para crear gráficos
   * @param canvas Elemento canvas donde se dibuja
   * @param type Tipo de gráfico (bar, line, etc)
   * @param label Leyenda del dataset
   * @param labels Etiquetas del eje X
   * @param data Datos numéricos del dataset
   * @param bgColor Color de fondo
   * @param borderColor Color de borde
   */
  private crearGrafico( // funcion reutilizable para crear gráficos
    canvas: ElementRef<HTMLCanvasElement>,
    type: ChartType,
    label: string,
    labels: string[],
    data: number[],
    bgColor: string,
    borderColor: string
  ) {
    // Creamos una nueva instancia de Chart pasando el canvas y la configuración
    new Chart(canvas.nativeElement, {
      type: type, // tipo de gráfico (bar, line, etc)
      data: {
        labels: labels, // etiquetas en eje X
        datasets: [{
          label: label, // texto de la leyenda
          data: data, // datos numéricos
          backgroundColor: bgColor, // color de fondo
          borderColor: borderColor, // color de borde
          borderWidth: 1,
          fill: type === 'line' ? false : true, // para lineas no se rellena
          tension: type === 'line' ? 0.3 : 0 // suaviza líneas si es line
        }]
      },
      options: {
        responsive: true, // gráfico responsive
        scales: {
          y: { beginAtZero: true } // eje Y comienza en 0
        }
      }
    });
  }

  cargarClientes() {
    this.statsService.getClientes().subscribe(data => {
      // extraemos los labels y cantidades de la data recibida en el endpoint
      const labels = data.map(item => item.fecha);
      const cantidades = data.map(item => item.cantidad);

      // llamamos a la función general crearGrafico
      this.crearGrafico(
        this.clientesChart,
        'bar',
        'Clientes Registrados',
        labels,
        cantidades,
        'rgba(75, 192, 192, 0.5)',
        'rgba(75, 192, 192, 1)'
      );
    });
  }

  cargarAlquileres() {
    this.statsService.getAlquileres().subscribe(data => {
      const labels = data.map(item => item.fecha);
      const cantidades = data.map(item => item.cantidad);

      this.crearGrafico(
        this.alquileresChart,
        'bar',
        'Alquileres Realizados',
        labels,
        cantidades,
        'rgba(153, 102, 255, 0.5)',
        'rgba(153, 102, 255, 1)'
      );
    });
  }

  cargarIngresos() {
    this.statsService.getIngresos().subscribe(data => {
      const labels = data.map(item => item.fecha);
      const montos = data.map(item => item.monto);

      this.crearGrafico(
        this.ingresosChart,
        'line',
        'Ingresos',
        labels,
        montos,
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 159, 64, 1)'
      );
    });
  }

}
