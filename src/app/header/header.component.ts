import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  queryForm: FormGroup;


  constructor(private fb: FormBuilder) {
    this.queryForm = this.fb.group({
      database: ['', Validators.required],
      query: ['', Validators.required],
      table: ['', Validators.required],
      showColumns: ['true', Validators.required],
      columns: this.fb.array([]),
      updateColumns: this.fb.array([]),
      conditions: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.addColumnField();
  }
  public query: string = ""
  get columns(): FormArray {
    return this.queryForm.get('columns') as FormArray;
  }
  get updateColumns(): FormArray {
    return this.queryForm.get('updateColumns') as FormArray;
  }

  get conditions(): FormArray {
    return this.queryForm.get('conditions') as FormArray;
  }

  addColumnField(): void {
    const control = this.fb.group({
      column: ['']
    });
    (<FormArray>this.queryForm.get('columns')).push(control);
  }
  addUpdateColumn(): void {
    this.updateColumns.push(
      this.fb.group({
        column: ['', Validators.required],
        value: [''],
      })
    );
  }

  removeColumnField(index: number): void {
    this.columns.removeAt(index);
  }

  addWhereCondition(): void {
    this.conditions.push(
      this.fb.group({
        condition: ['', Validators.required],
        operator: [' = ', Validators.required],
        value: [''],
      })
    );
  }

  removeWhereCondition(index: number): void {
    this.conditions.removeAt(index);
  }
  removeUpdateColumn(index: number): void {
    this.updateColumns.removeAt(index);
  }
  public getColumnQueryPreview(columns: string[]): string {
    if (columns.length === 0) {
      return "*";
    }
    if (columns.length === 1 && columns[0] === "*") {
      return "*";
    }
    return columns.join(", ");
  }
  payloadSelect(tableName: string, queryType: string, query: any, column: any[], conditions: any[]) {
    console.log(column)
    return {
      table: tableName,
      typeQuery: queryType,
      database: this.queryForm.get('database')?.value,
      query: query,
      viewColumns: column.length > 0 ? column.map(col => ({ column: col })) : [],
      where: conditions.map(c => ({ condition: c.condition, operator: c.operator, value: `'${c.value}'` })),
    };
  }

  payloadInsert(tableName: string, queryType: string, query: any, conditions: any[], updateColumns: any[]) {
    console.log(conditions)
    return {
      table: tableName,
      typeQuery: queryType,
      database: this.queryForm.get('database')?.value,
      query: query,
      viewColumns: [],
      where: [],
      updateColumns: updateColumns.map(c => ({ column: c.column, value: ` ${c.value}` }))
    };
  }


  payloadUpdate(tableName: string, queryType: string, query: any, column: any[], conditions: any[], updateColumns: any[]) {
    return {
      table: tableName,
      typeQuery: queryType,
      database: this.queryForm.get('database')?.value,
      query: query,
      viewColumns: column.map(col => ({ column: col })),
      where: conditions.map(c => ({ condition: c.condition, operator: c.operator, value: `'${c.value}'` })),
      updateColumns: updateColumns.map(c => ({ column: c.column, value: `'${c.value}'` }))
    };
  }

  payloadDelete(tableName: string, queryType: string, query: any, conditions: any[]) {
    return {
      table: tableName,
      typeQuery: queryType,
      database: this.queryForm.get('database')?.value,
      column: [],
      query: query,
      viewColumns: [],
      where: conditions.map(c => ({ condition: c.condition, operator: c.operator, value: `'${c.value}'` })),
      updateColumns: []
    };
  }



  submit(): void {
    if (this.queryForm.valid) {
      const queryType = this.queryForm.get('query')?.value ?? 'Select';
      const tableName = this.queryForm.get('table')?.value ?? '';
      const column = this.getColumns().map(c => { return c.column });
      const updateColumns = this.getUpdateColumns();
      const conditions = this.getConditions();

      if (this.queryForm.valid) {
        console.log(this.queryForm.value);
      }

      let query = '';
      switch (queryType.toUpperCase()) {
        case 'SELECT':
          if (column.length === 0 || column[0] === '') {
            query = `SELECT * FROM ${tableName}`;
          } else {
            query = `SELECT ${this.getColumnQueryPreview(column)} FROM ${tableName}`;
          }
          break;
        case 'INSERT':
          query = `INSERT INTO ${tableName} (${updateColumns.map(col => `${col.column}`).join(', ')}) VALUES (${updateColumns.map(col => `'${col.value}'`).join(', ')})`;
          break;
        case 'UPDATE':
          query = `UPDATE ${tableName} SET ${this.getColumnQueryPreview(column)} =1`;
          break;
        case 'DELETE':
          query = `DELETE FROM ${tableName}`;
          console.log(tableName)
          break;
      }

      const whereClause = this.mapCondition(conditions);
      if (whereClause && queryType.toUpperCase() !== 'INSERT') {
        query += ` WHERE ${whereClause}`;
      }

      console.log('Query gerada:', query);


      //     switch (queryType.toUpperCase()) {
      //       case 'SELECT':
      //         const apiData: Api = this.payloadSelect(tableName, queryType, query, column, conditions);
      //         console.log(this.payloadSelect)
      //         this.apiService.getselect(apiData)
      //         break;
      //       case 'INSERT':
      //         const apiDataInsert: Api = this.payloadInsert(tableName, queryType, query, conditions, updateColumns)
      //         this.apiService.insert(apiDataInsert)
      //           ;
      //         break;
      //       case 'UPDATE':
      //         const apiDataUpdate: Api = this.payloadUpdate(tableName, queryType, query, column, conditions, updateColumns)
      //         this.apiService.update(apiDataUpdate)

      //         break;
      //       case 'DELETE':
      //         const apiDatadelete: Api = this.payloadDelete(tableName, queryType, query, conditions)
      //         this.apiService.delete(apiDatadelete)
      //         break;

      //     }
      //   } else {
      //     console.error('O formulário contém erros.');
    }
  }

  getColumns(): any[] {
    return this.queryForm.get('columns')?.value as any[];
  }
  getUpdateColumns(): any[] {
    return this.queryForm.get('updateColumns')?.value as any[];
  }

  getConditions(): any[] {
    return (this.queryForm.get('conditions') as FormArray).controls.map(c => c.value);
  }

  mapCondition(conditions: any[]): string {
    return conditions.map(cond => `${cond.condition} ${cond.operator} '${cond.value}'`).join(' AND ');
  }

}