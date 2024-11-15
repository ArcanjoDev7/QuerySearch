import { Component } from '@angular/core';
import { MultiField } from '../../models/multifield';
import { CommonModule } from '@angular/common'
import { MultiFieldWhere } from '../../models/multifield-where';
import { WhereCondition } from '../../models/where-condition';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public columns: MultiField[] = [
    {
      id: "column-0",
      value: ""
    }
  ]
  public conditions: MultiFieldWhere[] = [
    {
      column: "where-column-0",
      operation: "condition-0",
      value: "where-value-0"
    }
  ]
  public query: string = ""

  public addColumnField(index: number) {
    this.columns.push({
      id: "column-" + index,
      value: ""
    })
  }
  public removeColumnField(index: number) {
    this.columns.splice(index, 1)
  }

  public addWhereCondition(index: number) {
    if (this.conditions.length === 3) return
    this.conditions.push({
      column: "where-column-" + index,
      operation: "condition-" + index,
      value: "where-value-" + index
    })
  }
  public removeWhereCondition(index: number) {
    this.conditions.splice(index, 1)
  }

  public submit() {
    const queryType = (this.getInputValue("query") ?? "Select").toUpperCase()
    const tableName = this.getInputValue("table") ?? ""
    const columns = this.getColumns()
    const conditions = this.getConditions()

    this.query = `${queryType} ${this.getColumnQueryPreview(columns)} FROM ${tableName} WHERE ${this.mapCondition(conditions)}`
  }

  public mapCondition(conditions: WhereCondition[]) {
    const strConditions: string[] = []

    for (let condition of conditions) {
      strConditions.push(`${condition.column} ${condition.operator} ${condition.value}`)
    }

    return strConditions.join(" AND ")
  }
  public getColumnQueryPreview(columns: string[]) {
    if (columns.length === 1) {
      if (columns[0] === "*") return "*"
    }

    return `(${columns.join(",")})`
  }

  public getInputValue(id: string): string | null {
    const input = document.getElementById(id)
    if (!input) return null

    return (input as HTMLInputElement).value
  }
  public getColumns() {
    const columns: string[] = []

    for (let column of this.columns) {
      const value = this.getInputValue(column.id)
      if (value) {
        columns.push(value)
      }
    }

    return columns
  }
  public getConditions() {
    const conditions: WhereCondition[] = []

    for (let condition of this.conditions) {
      const column = this.getInputValue(condition.column) ?? ""
      const operator = this.getInputValue(condition.operation) ?? ""
      const value = this.getInputValue(condition.value) ?? ""

      conditions.push({
        column,
        operator,
        value
      })
    }

    return conditions
  }
}
