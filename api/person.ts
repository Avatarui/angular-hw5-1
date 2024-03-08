import express, { Express } from "express";
import { conn, mysql, queryAsync } from "../dbconnect";
import { Insertperson } from "../model/person";
export const router = express.Router();
//http://localhost:3000/person
router.get("/", (req, res) => {
    conn.query('select * from person', (err, result, fields) => {
        if (result && result.length > 0) {
            res.json(result);
        }
        else {
            res.json({
                success: false,
                Error: "Incorrect Person."
            });
        }
    });
});

//http://localhost:3000/person/Tom Cruise
router.get("/:search", (req, res) => {
    const searchname = req.params.search;
    let sql = "SELECT * FROM person WHERE name=?";
    conn.query(sql,[searchname],(err,result)=>{
        if(err)throw err;
        res.status(200);
        res.json(result);
    });
});
//http://localhost:3000/person/searchsome/will
router.get("/searchsome/:searchname", (req, res) => {
    const searchname = req.params["searchname"];
    let sql = "SELECT * FROM person WHERE name LIKE ?";
    conn.query(sql, [`%${searchname}%`], (err, result) => {
      if (err) throw err;
      res.status(200);
      res.json(result);
    });
  });

  
// {
//     "name":"........"
// }



router.post("/insert", (req, res) => {
    let insertperson: Insertperson = req.body;
    let sql = "insert into person(name)value(?)";
    sql = mysql.format(sql, [
        insertperson.name,
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
    });
})

router.delete("/delete/:person", async (req, res) => {
    const person = req.params.person;
    let pid: number;
    let sql = mysql.format("select personID from person where name = ?", [person])
    let result = await queryAsync(sql);
    const jsonStr = JSON.stringify(result);
    const jsonobj = JSON.parse(jsonStr);
    const rowData = jsonobj;
    pid = rowData[0].pid;
    conn.query("delete from person where personID = ?", [pid], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});


router.delete("/:personID", (req, res) => {
    const personID = req.params.personID;
    let sql = "DELETE FROM `person` WHERE personID=?";
    conn.query(sql, [personID], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});