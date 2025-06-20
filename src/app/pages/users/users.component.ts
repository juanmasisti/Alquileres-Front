import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [CommonModule,NavbarComponent, FooterComponent, ],
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private userService: UserService, private dialog: MatDialog,) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
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
}
