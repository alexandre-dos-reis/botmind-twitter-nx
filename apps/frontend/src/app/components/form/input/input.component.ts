import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
})
export class InputComponent implements OnInit {
  @Input() name!: string;
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() error!: string;
  @Input() parentForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.name = '';
    this.type = '';
    this.placeholder = '';
    this.error = '';
  }
}
