require("./misc")

class DataEntry {
    constructor(msg, user) {
      this.time = helper.getTimestamp();
      this.msg = msg;
    }
    save(){
        conn.query("",[])
    }

  }