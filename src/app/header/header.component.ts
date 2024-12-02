import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    public queryForm: FormGroup;
    public query: string = ""


    public constructor(private fb: FormBuilder) {
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


            switch (queryType.toUpperCase()) {
                case 'SELECT':
                    if (column.length === 0 || column[0] === '') {
                        this.query = `SELECT * FROM ${tableName}`;
                    } else {
                        this.query = `SELECT ${this.getColumnQueryPreview(column)} FROM ${tableName}`;
                    }
                    break;
                case 'INSERT':
                    this.query = `INSERT INTO ${tableName} (${updateColumns.map(col => `${col.column}`).join(', ')}) VALUES (${updateColumns.map(col => `'${col.value}'`).join(', ')})`;
                    break;
                case 'UPDATE':
                    this.query = `UPDATE ${tableName} SET ${this.getColumnQueryPreview(column)} =1`;
                    break;
                case 'DELETE':
                    this.query = `DELETE FROM ${tableName}`;
                    console.log(tableName)
                    break;
            }

            const whereClause = this.mapCondition(conditions);
            if (whereClause && queryType.toUpperCase() !== 'INSERT') {
                this.query += ` WHERE ${whereClause}`;
            }

            console.log('Query gerada:', this.query);
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
