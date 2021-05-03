import { ATeHelper } from "./../libs/ate-helper";

export class LocalDatabaseSqlJs {
  public demoSqlJsPromise() {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    ATeHelper.emptyPromise
      .then(() => console.log("\n>>> allTestNanoSql\n"))
      .then(() => console.log("\n--- testSqlJs ---\n"))
      .then(this.testSqlJs)
      .then(() => {
        console.log("\n\n\nwait 5 sec...\n\n\n");
        return wait(5 * 1000);
      })
      .then(this.testSqlJs)
      .then(() => {
        console.log("\n\n\nwait 5 sec...\n\n\n");
        return wait(5 * 1000);
      })
      .finally(() => console.log("\nfinally\n"));
  }

  public testSqlJs(): Promise<void> {
    console.log(">>> testSqlJs");

    var initSqlJs = require("src/assets/sql.js/dist/sql-wasm.js");
    //ok aussi var initSqlJs = require('node_modules/sql.js/dist/sql-wasm.js');

    var config = {
      locateFile: filename => {
        console.log(filename);
        return `./assets/sql.js/dist/${filename}`;
      }
    };
    // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
    // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
    let promise = initSqlJs(config).then(function(SQL) {
      //Create the database
      var db = new SQL.Database();
      // Run a query without reading the results
      db.run("CREATE TABLE test (col1, col2);");
      // Insert two rows: (1,111) and (2,222)
      db.run("INSERT INTO test VALUES (?,?), (?,?)", [1, 111, 2, 222]);

      // Prepare a statement
      var stmt = db.prepare(
        "SELECT * FROM test WHERE col1 BETWEEN $start AND $end"
      );
      stmt.getAsObject({ $start: 1, $end: 1 }); // {col1:1, col2:111}

      // Bind new values
      stmt.bind({ $start: 1, $end: 2 });
      while (stmt.step()) {
        //
        var row = stmt.getAsObject();
        console.log("Here is a row: " + JSON.stringify(row));
        //alert('Here is a row: ' + JSON.stringify(row));
      }
    });
    return promise;
  }

  public demoSqlJsAsyncAwait() {
    this.testSqlJs2();
  }

  private static SqlJs: any = null;

  public async GetSqlJs() {
    if (LocalDatabaseSqlJs.SqlJs == null) {
      var initSqlJs = require("src/assets/sql.js/dist/sql-wasm.js");

      var config = {
        locateFile: filename => `./assets/sql.js/dist/${filename}`
      };
      // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
      // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
      const sql = await initSqlJs(config);
      LocalDatabaseSqlJs.SqlJs = sql;
    }

    return LocalDatabaseSqlJs.SqlJs;
  }

  public async testSqlJs2() {
    let sqlJs = await this.GetSqlJs();

    //SELECT COUNT(*) FROM sqlite_master WHERE type='table' and name='MyTable'"

    //Create the database
    var db = new sqlJs.Database();

    // Run a query without reading the results
    db.run("CREATE TABLE test (col1, col2);");

    let nbRecords = 0;
    for (var i = 0; i < 50; i++) {
      // Insert two rows: (1,111) and (2,222)
      db.run("INSERT INTO test VALUES (?,?), (?,?)", [
        2 * i,
        111,
        2 * i + 1,
        222
      ]);
      nbRecords += 2;
    }

    // Prepare a statement
    var stmt = db.prepare(
      "SELECT * FROM test WHERE col1 BETWEEN $start AND $end"
    );
    var row1 = stmt.getAsObject({ $start: 1, $end: 3 }); // {col1:1, col2:111}
    console.log("Here is row1: " + JSON.stringify(row1));

    // Bind new values
    stmt.bind({ $start: nbRecords - 1, $end: nbRecords - 1 });
    while (stmt.step()) {
      //
      var row = stmt.getAsObject();
      console.log("Here is a row: " + JSON.stringify(row));
      //alert('Here is a row: ' + JSON.stringify(row));
    }
  }
}

class SqlJsHelper {
  private static SqlJsAsync: any = null;
  private static SqlJs: any = null;

  public static async GetSqlJsAsync() {
    if (SqlJsHelper.SqlJsAsync == null) {
      var initSqlJs = require("src/assets/sql.js/dist/sql-wasm.js");

      var config = {
        locateFile: filename => `./assets/sql.js/dist/${filename}`
      };
      // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
      // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
      const sql = await initSqlJs(config);
      SqlJsHelper.SqlJsAsync = sql;
    }

    return SqlJsHelper.SqlJsAsync;
  }

  public static GetSqlJs() {
    if (SqlJsHelper.SqlJs == null) {
      var initSqlJs = require("src/assets/sql.js/dist/sql-wasm.js");

      var config = {
        locateFile: filename => `./assets/sql.js/dist/${filename}`
      };
      // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
      // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
      const sql = initSqlJs(config);
      SqlJsHelper.SqlJs = sql;
    }

    return SqlJsHelper.SqlJs;
  }
}

import { ILocalDbDemo } from "src/app/demo/local-databases/root-local-db-demo";
export class LocalDbDemoSqlJs implements ILocalDbDemo {
  async d01CreateDbInsertRecordsGetRecords(recordsCount: number) {
    let sqlJs = await SqlJsHelper.GetSqlJs();

    var db = new sqlJs.Database();
    db.run("CREATE TABLE test (col1, col2);");

    for (var i = 0; i < recordsCount; i++) {
      // Insert two rows: (1,111) and (2,222)
      db.run("INSERT INTO test VALUES (?,?)", [i, 5 + i * 123]);
    }

    var stmt = db.prepare(
      "SELECT * FROM test WHERE col1 BETWEEN $start AND $end"
    );

    let retValue = [];

    stmt.bind({ $start: 0, $end: recordsCount - 1 });
    while (stmt.step()) {
      //
      var row = stmt.getAsObject();
      retValue.push(row);
      //console.log("Here is a row: " + JSON.stringify(row));
    }

    return retValue;
  }
}
