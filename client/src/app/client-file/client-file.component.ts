import { Component } from '@angular/core';
import { ClientService } from '../_services/client.service';
import { faCoffee, faPager, faPen } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-client-file',
  templateUrl: './client-file.component.html',
  styleUrls: ['./client-file.component.css']
})
export class ClientFileComponent {
  faPen = faPen;
  searchNIF: string = '';
  clientFile: any = null;
  isEditing: boolean = false;
  editedClient: any = {};

  constructor(private clientService: ClientService, private toastr: ToastrService) {}

  searchClientFile(): void {
    this.clientService.getClientFileByNIF(this.searchNIF).subscribe(
      (response) => {
        console.log('Response:', response);
        if (response) {
          this.clientFile = response;
          this.toastr.success('Cliente encontrado!');
        } else {
          this.clientFile = null;
          console.log('Client file not found.');
          this.toastr.error('Cliente não encontrado!');
        }
      },
      (error) => {
        console.log('Error retrieving client file:', error);
        this.toastr.error('Erro ao mostrar ficha cliente!');
      }
    );
  }

  startEditing(): void {
    this.isEditing = true;
    this.editedClient = { ...this.clientFile.client };
  }

  saveChanges(): void {
    if (this.clientFile && this.clientFile.client) {
      const updatedClient = {
        ...this.clientFile.client,
        ...this.editedClient
      };

      this.clientService.updateClient(this.clientFile.client.nif, updatedClient).subscribe(
        (response: any) => {
          console.log('Client updated:', response);
          this.toastr.success('Cliente atualizado!');
          this.clientFile.client = { ...updatedClient };
          this.isEditing = false;
        },
        (error: any) => {
          console.log('Error updating client:', error);
          this.toastr.error('Erro ao atualizar cliente!');
        }
      );
    }
  }
}
