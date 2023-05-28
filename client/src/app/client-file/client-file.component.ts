import { Component } from '@angular/core';
import { ClientService } from '../_services/client.service';

@Component({
  selector: 'app-client-file',
  templateUrl: './client-file.component.html',
  styleUrls: ['./client-file.component.css']
})
export class ClientFileComponent{
  searchNIF: string = '';
  clientFile: any = null;

  constructor(private clientService: ClientService) { }

  searchClientFile(): void {
    this.clientService.getClientFileByNIF(this.searchNIF).subscribe(
      (response) => {
        console.log('Response:', response);
        if (response) {
          this.clientFile = response;
          console.log('Client file retrieved:', response);
        } else {
          this.clientFile = null;
          console.log('Client file not found.');
        }
      },
      (error) => {
        console.log('Error retrieving client file:', error);
      }
    );
  }



}
