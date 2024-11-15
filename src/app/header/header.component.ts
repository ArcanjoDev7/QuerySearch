import { Component } from '@angular/core';
import { MultiField } from '../../models/multifield';
import { CommonModule } from '@angular/common'

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
  public whereColumns: MultiField[] = [
    {
      id: "where-column-0",
      value: ""
    }
  ]
  public valueColumns: MultiField[] = [
    {
      id: "value-column-0",
      value: ""
    }
  ]
  public addColumnField(index: number) {
    this.columns.push({
      id: "column-" + index,
      value: ""
    })
  }
  public removeColumnField(index: number) {
    this.columns.splice(index, 1)
  }

  public addWhereColumnsField(index: number) {
    this.whereColumns.push({
      id: "where-column-0" + index,
      value: ""
    })
  }
  public removeWhereColumnsField(index: number) {
    this.whereColumns.splice(index, 1)
  }

  public addValueColumnsField(index: number) {
    this.valueColumns.push({
      id: "value-column-0" + index,
      value: ""
    })
  }
  public removeValueColumnsField(index: number) {
    this.valueColumns.splice(index, 1)
  }

}
