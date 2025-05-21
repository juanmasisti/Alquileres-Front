import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';
import { ManageComponent } from './manage/manage.component';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-person-profile',
  templateUrl: './person-profile.component.html',
  styleUrls: ['./person-profile.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NavbarComponent,
    FooterComponent,
    RouterLink,
    ManageComponent,
  ],
})
export class PersonProfileComponent implements OnInit {
  personDataForm: FormGroup;
  minDate!: string;
  maxDate!: string;
  // Expresiones regulares (las mismas que antes)
  private readonly NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s']+$/;
  private readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  private readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private readonly DNI_REGEX = /^\d{7,8}$/;
  private readonly PHONE_REGEX = /^\+54\s\d{2,4}\s\d{6,8}$/;

  // Datos de ejemplo (aca irian los datos actuales del usuario)
  name: string = 'Virginia';
  lastName: string = 'Lopez';
  email: string = 'eMail@test.com';
  phone: string = '2212345678';
  DNI: string = '44254667';
  BirthDate: string = '17/03/1999';

  constructor(private fb: FormBuilder) {
    this.personDataForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validateRegex(this.NAME_REGEX, 'invalidName'),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.validateRegex(this.NAME_REGEX, 'invalidLastName'),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          this.validateRegex(this.EMAIL_REGEX, 'invalidEmail'),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          this.validateRegex(this.PHONE_REGEX, 'invalidPhone'),
        ],
      ],
      dni: [
        '',
        [Validators.required, this.validateRegex(this.DNI_REGEX, 'invalidDni')],
      ],
      birthDate: ['', [Validators.required, this.validateAgeRange(18, 80)]],
    });
  }

  ngOnInit() {}

  private validateRegex(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // No validar si está vacío (dejamos eso a Validators.required)
      }
      const isValid = regex.test(control.value);
      return isValid ? null : { [errorKey]: { value: control.value } };
    };
  }

  private validateAgeRange(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Ajustar si aún no ha pasado el mes de cumpleaños
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < minAge) {
        return {
          tooYoung: {
            requiredAge: minAge,
            actualAge: age,
            message: `Debes tener al menos ${minAge} años`,
          },
        };
      }

      if (age > maxAge) {
        return {
          tooOld: {
            requiredAge: maxAge,
            actualAge: age,
            message: `La edad máxima permitida es ${maxAge} años`,
          },
        };
      }

      return null;
    };
  }

  editarDatos() {
    throw new Error('Method not implemented.');
  }
}
