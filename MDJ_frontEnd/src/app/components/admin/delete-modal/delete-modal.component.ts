import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/users/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  slug?: any;
  error : string = '';

  protected activeModal = inject(NgbActiveModal);
  protected userService = inject(UserService);

  ngOnInit(): void {
   
  }


  cancel(): void {
    this.activeModal.dismiss();
  }
  delete():void{
    this.userService.deleteUser(this.slug).subscribe({
      next: (data) => {
        this.activeModal.close();
      },
      error: (error) => {
        this.error = "erreur rencontré lors de la suppression";
      }
    });
  }
  

}

