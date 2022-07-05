import { Component } from '@angular/core';
import { MessageService } from '../../service/message.service';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
})
export class FlashMessageComponent {
  constructor(public messageService: MessageService) {}
}
