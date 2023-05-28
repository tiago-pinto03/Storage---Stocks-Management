import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFileComponent } from './client-file.component';

describe('ClientFileComponent', () => {
  let component: ClientFileComponent;
  let fixture: ComponentFixture<ClientFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
