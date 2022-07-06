import { Component, Input, OnInit } from '@angular/core';
import { Reply } from '@botmind-twitter-nx/api-interface';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
})
export class ReplyComponent implements OnInit {
  
  @Input() reply!: Reply;

  constructor() {}

  ngOnInit(): void {}
}
