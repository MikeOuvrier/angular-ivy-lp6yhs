import { Component } from "@angular/core";

import { LocalDbDemoFabrik } from "src/app/demo/local-databases/root-local-db-demo";
import { LocalDatabaseNanoSql } from "src/app/demo/local-databases/local-database-nano-sql";
import { LocalDatabaseSqlJs } from "src/app/demo/local-databases/local-database-sql-js";
import { LocalDatabaseDexie } from "src/app/demo/local-databases/local-database-dexie";

/* 101 */

@Component({
  selector: "app-root",
  templateUrl: "./demo.app.component.html",
  styleUrls: ["./demo.app.component.css"]
})
export class DemoAppComponent {
  title = "CodeSandbox";

  nanoSqlPromise(): void {
    new LocalDatabaseNanoSql().demoNanoSqlPromise();
  }

  nanoSqlAsyncAwait(): void {
    new LocalDatabaseNanoSql().demoNanoSqlAsyncAwait();
  }

  sqlJsPromise(): void {
    new LocalDatabaseSqlJs().demoSqlJsPromise();
  }

  sqlJsAsyncAwait(): void {
    new LocalDatabaseSqlJs().demoSqlJsAsyncAwait();
  }

  dexiePromise(): void {
    new LocalDatabaseDexie().demoDexiePromise();
  }
  async localDbDemo(demoName: string): Promise<any> {
    let demo = LocalDbDemoFabrik.newDemo(demoName);
    let rows = await demo.d01CreateDbInsertRecordsGetRecords(3);

    console.log(demoName + " " + JSON.stringify(rows));
  }
}
