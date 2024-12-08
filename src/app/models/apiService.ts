import { Query } from "@angular/core"

export interface Api {
    tableName: string;
    queryType: string;
    query: Query;
    columns: ViewColumns[];
    where: Conditions[];
    updateColumns: UpdateColumns[];
}

export interface ViewColumns {
    column: string;
}
export interface Conditions {
    condition: string;
    operator: string;
    value: string;
}
export interface UpdateColumns {
    column: string;
    value: string;
}