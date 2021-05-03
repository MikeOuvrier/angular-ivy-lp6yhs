import { LocalDatabaseNanoSql } from "./local-database-nano-sql";
import { LocalDatabaseSqlJs } from "./local-database-sql-js";

export interface ILocalDbDemo {
  d01CreateDbInsertRecordsGetRecords(recordsCount: number): any;
}

export class LocalDbDemoFabrik {
  public static newDemo(demoName: string): ILocalDbDemo {
    let retValue: ILocalDbDemo = null;
    switch (demoName) {
      case "nano-sql": {
        return new LocalDbDemoNanoSql();
        break;
      }
      case "sql-js": {
        return new LocalDbDemoSqlJs();
      }
    }
    return retValue;
  }
}

interface IEmployee {
  empCode: number;
  name: string;
  getSalary: (number) => number;
}

class Employee implements IEmployee {
  empCode: number;
  name: string;

  constructor(code: number, name: string) {
    this.empCode = code;
    this.name = name;
  }

  getSalary(empCode: number): number {
    return 20000;
  }
}

let emp = new Employee(1, "Steve");
