import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CreateUserModalComponent } from 'src/app/shared/components/create-user-modal/create-user-modal.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [CommonModule,NavbarComponent, FooterComponent, FormsModule ],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading = true;
  searchTerm: string = ''; // para almacenar el término de búsqueda

  constructor(private userService: UserService, private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredUsers = this.users.filter(u =>
      u.nombre.toLowerCase().includes(term) ||
      u.apellido.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
        console.log('Usuarios cargados:', this.users);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      },
    });
  }

  deactivateUser(userId: string): void {
    // Abrimos el modal de confirmación
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: '¿Estás seguro/a?',
          description: 'Esta acción eliminará la cuenta del usuario permanentemente.',
          confirmText: 'Sí, eliminar',
          cancelText: 'Cancelar',
          //icon: 'error' // Mostramos ícono de advertencia
        }
      });

      // Nos suscribimos al observable que devuelve el modal luego de cerrarse
      dialogRef.afterClosed().subscribe((confirmed: boolean) => { // nos subscribimos al observable que devuelve afterClosed
        // confirmed será true si el usuario hizo clic en "Sí, eliminar"
        // o false si hizo clic en "Cancelar"
        if (confirmed) {
          this.userService.deactivateUser(userId).subscribe({ // nos subscribimos al observable que devuelve deleteProfile
            // Si la eliminación es exitosa
            next: () => {
              this.dialog.open(ConfirmModalComponent, {
                data: {
                  title: 'Cuenta eliminada',
                  description: 'La cuenta fue eliminada correctamente.',
                  confirmText: 'Aceptar',
                  icon: 'success'
                }
              }).afterClosed().subscribe(() => {
                console.log(`Usuario con ID ${userId} desactivado`);
                this.loadUsers(); // Recargar la lista de usuarios
              });
            },
            // Si ocurre un error al eliminar la cuenta
            error: (err) => {
              console.error(`Error al desactivar usuario con ID ${userId}:`, err);
              this.dialog.open(ConfirmModalComponent, {
                data: {
                  title: 'Error al eliminar',
                  description: err.error.message || 'Ocurrió un error al eliminar la cuenta. Por favor, intentá nuevamente más tarde.',
                  confirmText: 'Aceptar',
                  icon: 'info'
                }
              }
            );
            }
          });
        }
      });
    }

    reactivateUser(userId: string): void {
      // Abrimos el modal de confirmación
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: '¿Estás seguro/a?',
          description: 'Esta acción reactivará la cuenta del usuario.',
          confirmText: 'Sí, reactivar',
          cancelText: 'Cancelar',
        }
      });

      // Nos suscribimos al observable que devuelve el modal luego de cerrarse
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.userService.reactivateUser(userId).subscribe({
            next: () => {
              this.dialog.open(ConfirmModalComponent, {
                data: {
                  title: 'Cuenta reactivada',
                  description: 'La cuenta fue reactivada correctamente.',
                  confirmText: 'Aceptar',
                  icon: 'success'
                }
              }).afterClosed().subscribe(() => {
                console.log(`Usuario con ID ${userId} reactivado`);
                this.loadUsers(); // Recargar la lista de usuarios
              });
            },
            error: (err: any) => {
              console.error(`Error al reactivar usuario con ID ${userId}:`, err);
              this.dialog.open(ConfirmModalComponent, {
                data: {
                  title: 'Error al reactivar',
                  description: err.error.message || 'Ocurrió un error al reactivar la cuenta. Por favor, intentá nuevamente más tarde.',
                  confirmText: 'Aceptar',
                  icon: 'info'
                }
              });
            }
          });
        }
      });
    }

    openCreateUserModal(): void {
      const dialogRef = this.dialog.open(CreateUserModalComponent, {
        data: {
          tipoCuenta: 'empleado', // o 'cliente' si lo usas en otro lado
          titulo: 'Crear Cuenta de Empleado',
          accionLabel: 'Crear'
        },
        width: '700px',
        maxWidth: '95vw', // para que no se rompa en mobile
        height: '70vh',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadUsers(); // recargar usuarios si se creó uno nuevo
        }
      });
    }
}
