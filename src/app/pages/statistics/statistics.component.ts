import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, TemplateRef } from '@angular/core';
import { StatsService } from 'src/app/services/stats.service';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { Chart, registerables, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

Chart.register(...registerables); // Registra todos los componentes de chart.js existentes

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, 
    MatDialogModule, FormsModule, MatButtonModule, MatCheckboxModule]
})
export class StatisticsComponent implements OnInit, AfterViewInit {

  // ViewChild obtiene referencia al elemento canvas en el template una vez renderizado
  @ViewChild('clientesChart') clientesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('alquileresChart') alquileresChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('ingresosChart') ingresosChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('exportModal') exportModal!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;

  // Datos para ver si hay información cargada
  clientesData: any[] = [];
  alquileresData: any[] = [];
  ingresosData: any[] = [];
  noData: boolean = false;

  // Variables para checkboxes del modal
  exportClientes: boolean = false;
  exportAlquileres: boolean = false;
  exportIngresos: boolean = false;
  exportAll: boolean = false; // Checkbox para seleccionar/deseleccionar todos

  // Datos filtrados que se mostrarán en los gráficos
  clientesFiltrados: any[] = [];
  alquileresFiltrados: any[] = [];
  ingresosFiltrados: any[] = [];

  // periodos para filtrar datos
  periods = [
    { value: 'dia', label: 'Día' },
    { value: 'mes', label: 'Mes' },
    { value: 'anio', label: 'Año' }
  ];

  clientesPeriodo: string = '';  // Período inicial para clientes
  alquileresPeriodo: string = ''; // Período inicial para alquileres
  ingresosPeriodo: string = '';   // Período inicial para ingresos

  constructor(private statsService: StatsService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.statsService.getClientes().subscribe(data => {
      this.clientesData = data;
      this.filtrarClientes();
    });
    
    this.statsService.getAlquileres().subscribe(data => {
      this.alquileresData = data;
      this.filtrarAlquileres();
    });
    
    this.statsService.getIngresos().subscribe(data => {
      this.ingresosData = data;
      this.filtrarIngresos();
    });
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

  toggleClientesPeriodo(period: string) {
  if (this.clientesPeriodo === period) {
    this.clientesPeriodo = ''; // deselecciona y muestra todos
  } else {
    this.clientesPeriodo = period; // setea el filtro
  }
  this.filtrarClientes(); // aplica filtro
}

toggleAlquileresPeriodo(period: string) {
  if (this.alquileresPeriodo === period) {
    this.alquileresPeriodo = '';
  } else {
    this.alquileresPeriodo = period;
  }
  this.filtrarAlquileres();
}

toggleIngresosPeriodo(period: string) {
  if (this.ingresosPeriodo === period) {
    this.ingresosPeriodo = '';
  } else {
    this.ingresosPeriodo = period;
  }
  this.filtrarIngresos();
}

  filtrarClientes() {
    if (!this.clientesData.length) return;

    if (!this.clientesPeriodo) {
      // si no hay periodo seleccionado, muestra todos
      this.actualizarGrafico(
        this.clientesChart,
        'bar',
        'Clientes Registrados',
        this.clientesData.map(item => item.fecha),
        this.clientesData.map(item => item.cantidad),
        'rgba(75, 192, 192, 0.5)',
        'rgba(75, 192, 192, 1)'
      );
      return;
    }

    const filteredData = this.clientesData.filter(item => {
      const date = new Date(item.fecha);
      const now = new Date();

      switch(this.clientesPeriodo) {
        case 'dia': 
          return date.toDateString() === now.toDateString();
        case 'mes':
          return date.getMonth() === now.getMonth() && 
                date.getFullYear() === now.getFullYear();
        case 'anio':
          return date.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    this.actualizarGrafico(
      this.clientesChart,
      'bar',
      'Clientes Registrados',
      filteredData.map(item => item.fecha),
      filteredData.map(item => item.cantidad),
      'rgba(75, 192, 192, 0.5)',
      'rgba(75, 192, 192, 1)'
    );
  }


  filtrarAlquileres() {
    if (!this.alquileresData.length) return;

    if (!this.alquileresPeriodo) {
      // si no hay periodo seleccionado, muestra todos
      this.actualizarGrafico(
        this.alquileresChart,
        'bar',
        'Alquileres Realizados',
        this.alquileresData.map(item => item.fecha),
        this.alquileresData.map(item => item.cantidad),
        'rgba(153, 102, 255, 0.5)',
        'rgba(153, 102, 255, 1)'
      );
      return;
    }

    const filteredData = this.alquileresData.filter(item => {
      const date = new Date(item.fecha);
      const now = new Date();
      
      switch(this.alquileresPeriodo) {
        case 'dia': 
          return date.toDateString() === now.toDateString();
        case 'mes':
          return date.getMonth() === now.getMonth() && 
                date.getFullYear() === now.getFullYear();
        case 'anio':
          return date.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    this.actualizarGrafico(
      this.alquileresChart,
      'bar',
      'Alquileres Realizados',
      filteredData.map(item => item.fecha),
      filteredData.map(item => item.cantidad),
      'rgba(153, 102, 255, 0.5)',
      'rgba(153, 102, 255, 1)'
    );
  }

  filtrarIngresos() {
    if (!this.ingresosData.length) return;

    if (!this.ingresosPeriodo) {
      // si no hay periodo seleccionado, muestra todos
      this.actualizarGrafico(
        this.ingresosChart,
        'line',
        'Ingresos',
        this.ingresosData.map(item => item.fecha),
        this.ingresosData.map(item => item.monto),
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 159, 64, 1)'
      );
      return;
    }

    const filteredData = this.ingresosData.filter(item => { // filtramos los ingresos, convirtiendo la fecha a Date y entrando al switch en cada caso correspondiente.
      const date = new Date(item.fecha);
      const now = new Date();
      
      switch(this.ingresosPeriodo) {
        case 'dia': 
          return date.toDateString() === now.toDateString();
        case 'mes':
          return date.getMonth() === now.getMonth() && 
                date.getFullYear() === now.getFullYear();
        case 'anio':
          return date.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    this.actualizarGrafico( // actualizamos el gráfico de ingresos con los datos filtrados
      this.ingresosChart,
      'line',
      'Ingresos',
      filteredData.map(item => item.fecha),
      filteredData.map(item => item.monto),
      'rgba(255, 159, 64, 0.5)',
      'rgba(255, 159, 64, 1)'
    );
  }


  // Función para actualizar los gráficos con los datos filtrados
  private actualizarGrafico(
    canvasRef: ElementRef<HTMLCanvasElement>,
    type: ChartType,
    label: string,
    labels: string[],
    data: number[],
    bgColor: string,
    borderColor: string
  ) {
    const chart = Chart.getChart(canvasRef.nativeElement); // obtenemos el gráfico existente si ya fue creado
    
    if (chart) { // Si el gráfico ya existe, actualizamos sus datos
      chart.data.labels = labels; // actualizamos las etiquetas del eje X
      chart.data.datasets[0].data = data; // actualizamos los datos del dataset
      chart.update(); // actualizamos el gráfico para reflejar los cambios
    } else {
      this.crearGrafico(canvasRef, type, label, labels, data, bgColor, borderColor); 
    }
  }

  verificarSinDatos() {
    this.noData = !this.clientesData.length && !this.alquileresData.length && !this.ingresosData.length;
  }

  openExportDialog() {
    this.exportClientes = false;
    this.exportAlquileres = false;
    this.exportIngresos = false;
    this.exportAll = false; // Reseteamos el checkbox de "Seleccionar todos"
    this.dialogRef = this.dialog.open(this.exportModal);
  }

  exportarPDF() {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight(); // Altura total de la página
    let currentY = 20; // Margen superior inicial para el primer gráfico

    // agregar gráficos con control de paginación, evitando que se corten.
    const agregarGrafico = (canvasRef: ElementRef<HTMLCanvasElement>, titulo: string, y: number) => {
      const canvas = canvasRef.nativeElement;
      
      // Creamos versiones ampliadas de cada gráfico para asegurar que todo el contenido sea capturado
      const tempCanvas = document.createElement('canvas'); 
      const context = tempCanvas.getContext('2d'); 
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height + 40; // Espacio adicional
      
      // Dibujar el gráfico original en el temporal
      context?.drawImage(canvas, 0, 0);
      
      const imgData = tempCanvas.toDataURL('image/png'); // Convertimos el canvas a imagen PNG
      const imgProps = doc.getImageProperties(imgData); // Obtenemos las propiedades de la imagen
      const pdfWidth = doc.internal.pageSize.getWidth() - 20; // Ancho del PDF menos márgenes
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width; // Altura proporcional de la imagen
      
      // Verificar si necesita nueva página
      if (y + pdfHeight > pageHeight - 20) { // si el gráfico no cabe en la página actual
        doc.addPage(); 
        y = 20; // Reset Y position
        currentY = 20;
      }
      
      doc.text(titulo, 10, y);
      doc.addImage(imgData, 'PNG', 10, y + 10, pdfWidth, pdfHeight);
      
      return y + pdfHeight + 20; // Retorna la nueva posición Y para el siguiente gráfico
    };

    // Agregar gráficos seleccionados
    if (this.exportClientes) {
      currentY = agregarGrafico(this.clientesChart, 'Clientes Registrados', currentY);
    }
    if (this.exportAlquileres) {
      currentY = agregarGrafico(this.alquileresChart, 'Alquileres Realizados', currentY);
    }
    if (this.exportIngresos) {
      currentY = agregarGrafico(this.ingresosChart, 'Ingresos', currentY);
    }

    doc.save('estadisticas.pdf');
    this.dialogRef.close();
  }

  // Función para seleccionar o deseleccionar todos los checkboxes
  toggleSelectAll() {
    if (this.exportAll) {
      this.exportClientes = true;
      this.exportAlquileres = true;
      this.exportIngresos = true;
    } else {
      this.exportClientes = false;
      this.exportAlquileres = false;
      this.exportIngresos = false;
    }
  }

  updateSelectAll() {
    this.exportAll = this.exportClientes && this.exportAlquileres && this.exportIngresos;
  }

  hasSelection() {
    return this.exportClientes || this.exportAlquileres || this.exportIngresos;
  }
}

