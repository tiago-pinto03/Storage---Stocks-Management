import { Component, OnInit } from '@angular/core';
import { ClientService } from '../_services/client.service';
import { Client } from '../_models/client';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.css']
})
export class CreateClientComponent {
  client: Client = { name: '', nif: 0, email: ''};

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {}

  registerClient(): void {
    console.log('Client data:', this.client);

    this.clientService.registerClient(this.client).subscribe(
      (response) => {
        console.log('Client registration successful:', response);
      },
      (error) => {
        console.log('Client registration failed:', error);
      }
    );
  }

  resetForm(): void {
    this.client = {
      name: '',
      nif: 0,
      email: ''
    };
  }

}
