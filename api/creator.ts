import express, { Express } from "express";
import { conn, mysql, queryAsync } from "../dbconnect";
import { Insertcreator } from "../model/creator";
export const router = express.Router();

router.get("/", (req, res) => {
    conn.query('select * from creator', (err, result, fields) => {
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

router.post("/insert", async (req, res) => {
    let insertcreator: Insertcreator = req.body;
    let personID: number;
    let sql = mysql.format("select personID from person where name = ?", [insertcreator.personname])
    let result = await queryAsync(sql);
    let jsonStr = JSON.stringify(result);
    let jsonobj = JSON.parse(jsonStr);
    let rowData = jsonobj;
    personID = rowData[0].personID;

    let movieID: number;
    sql = mysql.format("select movieID from movie where name = ?", [insertcreator.moviename])
    result = await queryAsync(sql);
    jsonStr = JSON.stringify(result);
    jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    movieID = rowData[0].movieID;


    sql = "INSERT INTO `creator`(`movieID`, `personID`) VALUES (?,?)";
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
    sql = mysql.format("select movieID from movies where name = ?", [movie])
    result = await queryAsync(sql);
    jsonStr = JSON.stringify(result);
    jsonobj = JSON.parse(jsonStr);
    rowData = jsonobj;
    movieID = rowData[0].movieID;

    conn.query("delete from creator where movieID = ? and personID = ?", [movieID, personID], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});
router.delete("/deletebyid/:personID/:movieID", (req, res) => {
    let personID = +req.params.personID;
    let movieID = +req.params.movieID;
    conn.query("delete from creator where movieID = ? and personID = ?", [movieID, personID], (err, result) => {
        if (err) throw err;
        res
            .status(200)
            .json({ affected_row: result.affectedRows });
    });
});