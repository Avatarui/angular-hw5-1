import express from "express";
import { conn, mysql, queryAsync } from "../dbconnect";
import { Insertstar } from "../model/star";
export const router = express.Router();
router.get("/", (req, res) => {
    conn.query('select * from star', (err, result, fields) => {
        if (result && result.length > 0) {
            res.json(result);
        }
        else {
            res.json({
                success: false,
                Error: "Incorrect Select Stars."
            });
        }
    });
});

// {
//     "personname": "Tom Cruise",
//     "moviename": "Tranformer"
//   }
router.post("/insert", async (req, res) => {
    let person: Insertstar = req.body;
    let personID: number;
    let sql = mysql.format("select personID from person where name = ?", [person.personname])
    let result = await queryAsync(sql);
    let jsonStr = JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    personID = rowData[0].personID;

    let movieID: number;
    sql = mysql.format("select movieID from movie where name = ?", [person.moviename])
    result = await queryAsync(sql);
    jsonStr = JSON.stringify(result);
    jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    movieID = rowData[0].movieID;


    sql = "INSERT INTO `star`(`movieID`, `personID`) VALUES (?,?)";
    sql = mysql.format(sql, [
        movieID,
        personID,
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res
            .status(201)
            .json({ affected_row: result.affectedRows, last_idx: result.insertId });
    });
});
//http://localhost:3000/star/delete/Tom Cruise/Tranformer
router.delete("/delete/:person/:movie", async (req, res) => {
    const person = req.params.person;
    const movie = req.params.movie;

    let personID: number;
    let sql = mysql.format("select personID from person where name = ?", [person])
    let result = await queryAsync(sql);
    let jsonStr = JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    personID = rowData[0].personID;

    let movieID: number;
    sql = mysql.format("select movieID from movie where name = ?", [movie])
    result = await queryAsync(sql);
    jsonStr = JSON.stringify(result);
    jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    movieID = rowData[0].movieID;

    conn.query("delete from star where movieID = ? and personID = ?", [movieID, personID], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});
//http://localhost:3000/star/delete/personID/movieID
router.delete("/deletebyid/:pid/:mid", (req, res) => {
    let pid = +req.params.pid;
    let mid = +req.params.mid;
    conn.query("delete from star where movieID = ? and personID = ?", [mid, pid], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});