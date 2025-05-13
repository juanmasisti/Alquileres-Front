
# Alquieres-Front

## Descripción
Este es el frontend del proyecto **Manny Maquinarias**, desarrollada con [Angular CLI] version 19.2.10.

## Tecnologías utilizadas
- **Angular**: Framework principal para el desarrollo frontend.
- **SCSS**: Preprocesador de CSS para estilos.
- **TypeScript**: Lenguaje de programación utilizado para el desarrollo en Angular.
- **RxJS**: Librería para manejar programación reactiva y asincrónica.
- **Karma**: Herramienta para realizar pruebas unitarias.

## Requisitos previos
Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

- **Node.js** (Versión 22.15.0 o superior)
- **Angular CLI** (Versión 19.2.10 o superior)

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/juanmasisti/Alquileres-Front.git
   cd Alquileres-Front
   ```

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

## Ejecutar el proyecto en desarrollo

Para levantar el servidor de desarrollo y ver la aplicación en tu navegador, ejecuta:

```bash
ng serve
```

Luego abre tu navegador y visita [http://localhost:4200](http://localhost:4200). Cada vez que realices cambios en el código, la aplicación se recargará automáticamente.

## Generación de componentes y otros archivos

Para generar nuevos componentes, directivas, servicios u otros archivos de Angular, utiliza los siguientes comandos:

```bash
ng generate component component-name
ng generate service service-name
ng generate directive directive-name
```

## Construcción del proyecto

Para construir el proyecto en producción, ejecuta:

```bash
ng build
```

Los archivos de salida se generarán en la carpeta `dist/`.

## Pruebas unitarias

Para ejecutar las pruebas unitarias, usa:

```bash
ng test
```

Esto ejecutará Karma y ejecutará las pruebas de la aplicación.

## Pruebas de extremo a extremo

Para ejecutar las pruebas de extremo a extremo (E2E), usa:

```bash
ng e2e
```

Es posible que necesites instalar dependencias adicionales si deseas configurar las pruebas E2E.

## Contribuciones

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios.
4. Haz commit de tus cambios (`git commit -am 'Añadir nueva funcionalidad'`).
5. Sube tu rama (`git push origin feature/nueva-funcionalidad`).
6. Crea un Pull Request en GitHub.

## Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
