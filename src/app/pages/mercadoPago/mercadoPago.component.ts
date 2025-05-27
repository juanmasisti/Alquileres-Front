import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { MercadoPagoService } from 'src/app/services/mercadoPago.service';
import { environment } from 'src/environments/environment';
import { PagoModel } from 'src/app/models/pago.model';

declare var MercadoPago: any;

@Component({
  selector: 'app-contact',
  templateUrl: './mercadoPago.component.html',
  styleUrls: ['./mercadoPago.component.scss'],
  imports: [NavbarComponent, FooterComponent],
})
  
export class MercadoPagoComponent implements OnInit {
  

  constructor(
    private mercadoPagoService: MercadoPagoService
  ) {}

  ngOnInit() {
    const publicKey = environment.mercadoPagoPublicKey;
    const mp = new MercadoPago(publicKey);
    const bricksBuilder = mp.bricks();
    
    const item: PagoModel = {
      title: 'Tractor',
      price: 100
    }

    const renderWalletBrick = async (bricksBuilder:any, preferenceId: string) => {
      await bricksBuilder.create("wallet", "walletBrick_container", {
        initialization: {
          preferenceId: preferenceId,
          redirectMode: 'self',
        },
        customization: {
          theme:'dark',
          customStyle: {
            valueProp: 'practicality',
            valuePropColor: 'black',
            borderRadius: '10px',
            verticalPadding: '10px',
            horizontalPadding: '10px',
            hideValueProp: true,
          }
        }
      });
    };

    this.mercadoPagoService.getPreferenceId(item).subscribe(({
      next(res) {
        renderWalletBrick(bricksBuilder, res.id);
      },
      error(err) {
        console.log(err)
      },
    }));
  }
}