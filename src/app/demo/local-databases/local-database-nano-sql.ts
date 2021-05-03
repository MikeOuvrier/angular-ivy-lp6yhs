import { ATeHelper } from "./../libs/ate-helper";
import { ILocalDbDemo } from "./root-local-db-demo";
import { nSQL } from "nano-sql";

export class LocalDatabaseNanoSql {
  public demoNanoSqlPromise() {
    ATeHelper.emptyPromise
      .then(() => console.log("\n>>> allTestSqlJs\n"))
      .then(() => console.log("\n--- testNanoSql1 ---\n"))
      .then(this.testNanoSql1)
      //.then(this.testNanoSql1AsyncAwait)
      .then(() => {
        console.log("\n\n\nwait 5 sec...\n\n\n");
        return ATeHelper.waitPromise(5 * 1000);
      })
      .then(() => console.log("\n--- testNanoSql2 ---\n"))
      .then(this.testNanoSql2)
      .finally(() => console.log("\n<<< allTestNanoSql finally\n"));
  }

  public async demoNanoSqlAsyncAwait() {
    console.log("\n>>> allTestSqlJs\n");
    console.log("\n--- testNanoSql1 ---\n");
    //await this.testNanoSql1();
    await this.testNanoSql1AsyncAwait();
    console.log("\n\n\nwait 5 sec...\n\n\n");
    await ATeHelper.waitPromise(5 * 1000);
    console.log("\n--- testNanoSql2 ---\n");
    await this.testNanoSql2();
    console.log("\n<<< allTestNanoSql finally\n");
  }

  public testNanoSql1() {
    //}:Promise<void> {
    //
    // https://www.npmjs.com/package/nano-sql
    //

    /*
        to install nanoSql you need Pytgon and gyp
        see here: https://hisk.io/how-to-fix-node-js-gyp-err-cant-find-python-executable-python-on-windows/
            but before see : https://github.com/nodejs/node-gyp/issues/695
                set NODE_TLS_REJECT_UNAUTHORIZED=0
            then
                npm install --global --production windows-build-tools
                npm install node-gyp
        and then : npm i nano-sql --save
        */

    console.log(">>> testNanoSql1");

    // Use an instance table to query and organize existing tables of data.
    let promise = nSQL([
      { name: "bill", age: 20 },
      { name: "bob", age: 25 },
      { name: "jeb", age: 27 }
    ])
      .query("select", ["name", "age"])
      .exec()
      .then(x => {
        console.log("nanoSql intermédiaire 1");
        return x;
      })
      .then(y => {
        console.log(y);
        return y;
      })
      .then(rows => {
        console.log(rows); // <= [{name: "jeb", age: 27}]
      })
      .finally(() => console.log("testNanoSql 1 finally"));

    //return promise;
  }

  public async testNanoSql1AsyncAwait() {
    console.log(">>> testNanoSql1");

    // Use an instance table to query and organize existing tables of data.
    let promise = nSQL([
      { name: "bill", age: 20 },
      { name: "bob", age: 25 },
      { name: "jeb", age: 27 }
    ])
      .query("select", ["name", "age"])
      .exec();
    console.log("nanoSql intermédiaire 1");
    let rows = await promise;
    console.log(rows);

    console.log("<<< testNanoSql1");

    //return promise;
  }

  public testNanoSql2(): Promise<void> {
    console.log(">>> testNanoSql2");

    // Or declare database models and store data in nanoSQL, using it as a self contained RDBMS
    let promise = nSQL("users") //  "users" is our table name.
      .model([
        // Declare data model
        { key: "id", type: "int", props: ["pk", "ai"] }, // pk == primary key, ai == auto incriment
        { key: "name", type: "string" },
        { key: "age", type: "int" }
      ])
      .connect() // Init the data store for usage. (only need to do this once)
      .then(function(result) {
        return nSQL()
          .query("upsert", {
            // Add a record
            name: "bill",
            age: 20
          })
          .exec();
      })
      .then(function(result) {
        return nSQL()
          .query("select")
          .exec(); // select all rows from the current active table
      })
      .then(function(result) {
        console.log(result); // <= [{id:1, name:"bill", age: 20}]
      })
      .finally(() => console.log("testNanoSql2 finally"));

    return promise;
  }
}

export class LocalDbDemoNanoSql implements ILocalDbDemo {
  async d01CreateDbInsertRecordsGetRecords(recordsCount: number) {
    // Use an instance table to query and organize existing tables of data.
    let promise = nSQL([
      { name: "bill", age: 20 },
      { name: "bob", age: 25 },
      { name: "jeb", age: 27 }
    ])
      .query("select", ["name", "age"])
      .exec();
    let rows = await promise;

    return rows;
  }
}
