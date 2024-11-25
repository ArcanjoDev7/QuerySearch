import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  queryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.queryForm = this.fb.group({
      db: ['Oracle', Validators.required],
      query: ['Select', Validators.required],
      table: ['', Validators.required],
      showColumns: ['true', Validators.required],
      columns: this.fb.array([this.fb.control('')]), // Inicializa com um campo vazio
      conditions: this.fb.array([]), // Inicializa vazio
    });
  }
  ngOnInit(): void {

  }
  public query: string = ""
  get columns(): FormArray {
    return this.queryForm.get('columns') as FormArray;
  }

  get conditions(): FormArray {
    return this.queryForm.get('conditions') as FormArray;
  }

  addColumnField(): void {
    this.columns.push(this.fb.control(''));
  }

  removeColumnField(index: number): void {
    this.columns.removeAt(index);
  }

  addWhereCondition(): void {
    this.conditions.push(
      this.fb.group({
        column: ['', Validators.required],
        operation: ['=', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  removeWhereCondition(index: number): void {
    this.conditions.removeAt(index);
  }

  submit(): void {
    if (this.queryForm.valid) {
      console.log(this.queryForm.value);
    } else {
      console.error('O formulário contém erros.');
    }
  }
}