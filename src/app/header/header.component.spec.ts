import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

interface ViewColumns {
  column: string;
}

interface UpdateColumns {
  column: string;
  value: string;
}

interface Conditions {
  condition: string;
  operator: string;
  value: string;
}

describe('QueryFormHelper', () => {
  let queryForm: FormGroup;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBuilder]
    });

    const fb = TestBed.inject(FormBuilder);

    queryForm = fb.group({
      database: ['', Validators.required],
      query: ['', Validators.required],
      table: ['', Validators.required],
      showColumns: ['true', Validators.required],
      columns: fb.array([], Validators.minLength(1)),
      updateColumns: fb.array([], Validators.minLength(1)),
      conditions: fb.array([])
    });
  });

  function getColumns(): ViewColumns[] {
    return queryForm.get('columns')?.value as any[];
  }

  function getUpdateColumns(): UpdateColumns[] {
    return queryForm.get('updateColumns')?.value as any[];
  }

  function getConditions(): Conditions[] {
    return (queryForm.get('conditions') as FormArray).controls.map(c => c.value);
  }

  function mapCondition(conditions: Conditions[]): string {
    return conditions
      .map(cond => `${cond.condition} ${cond.operator} '${cond.value}'`)
      .join(' AND ');
  }

  it('should return correct columns', () => {
    const mockColumns = [{ column: 'col1' }, { column: 'col2' }];
    queryForm.get('columns')?.setValue(mockColumns);

    const result = getColumns();
    expect(result).toEqual(mockColumns);
  });

  it('should return correct update columns', () => {
    const mockUpdateColumns = [
      { column: 'col1', value: 'val1' },
      { column: 'col2', value: 'val2' }
    ];
    queryForm.get('updateColumns')?.setValue(mockUpdateColumns);

    const result = getUpdateColumns();
    expect(result).toEqual(mockUpdateColumns);
  });

  it('should return correct conditions', () => {
    const mockConditions = [
      { condition: 'col1', operator: '=', value: 'val1' },
      { condition: 'col2', operator: '>', value: 'val2' }
    ];

    const conditionsFormArray = queryForm.get('conditions') as FormArray;
    mockConditions.forEach(cond => conditionsFormArray.push(new FormBuilder().group(cond)));

    const result = getConditions();
    expect(result).toEqual(mockConditions);
  });

  it('should map conditions to SQL string', () => {
    const mockConditions = [
      { condition: 'col1', operator: '=', value: 'val1' },
      { condition: 'col2', operator: '>', value: 'val2' }
    ];

    const result = mapCondition(mockConditions);
    expect(result).toEqual("col1 = 'val1' AND col2 > 'val2'");
  });

  it('should initialize with valid default values', () => {
    expect(queryForm.valid).toBe(false);
    expect(queryForm.get('showColumns')?.value).toBe('true');
    expect(queryForm.get('columns')?.value).toEqual([]);
    expect(queryForm.get('updateColumns')?.value).toEqual([]);
  });

  it('should validate required fields', () => {
    queryForm.patchValue({
      database: '',
      query: '',
      table: ''
    });
    expect(queryForm.valid).toBe(false);

    queryForm.patchValue({
      database: 'testDB',
      query: 'SELECT *',
      table: 'testTable'
    });
    expect(queryForm.valid).toBe(true);
  });
});
