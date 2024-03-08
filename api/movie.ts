import express, { Express } from "express";
import { conn, mysql, queryAsync } from "../dbconnect";
import { Insertmovie } from "../model/movie";
export const router = express.Router();

//search all movie
router.get("/", (req, res) => {
  let sql = "select * from movie";
  conn.query(sql, (err, result) => {
    res.status(200);
    res.json(result);
  });
});
//search full name
router.get("/:search", (req, res) => {
  const searchMovie = req.query.search;
  let sql = "SELECT * FROM movie WHERE name=?";
  conn.query(sql, [searchMovie], (err, result) => {
    if (err) throw err;
    res.status(200);
    res.json(result);
  });
});

// insert movie
router.post("/insert", (req, res) => {
  let insetMovie: Insertmovie = req.body;
  let sql = "insert into movie(name,online_date)value(?,?)";
  sql = mysql.format(sql, [insetMovie.name, insetMovie.online_date]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).json({ affected_row: result.affectedRows });
  });
});

//delete movie
router.delete("/delete/:movie", async (req, res) => {
  const movie = req.params.movie;
  let movieid: number;
  let sql = mysql.format("select movieID from movie where name = ?", [movie]);
  let result = await queryAsync(sql);
  const jsonStr = JSON.stringify(result);
  const jsonobj = JSON.parse(jsonStr);
  const rowData = jsonobj;
  movieid = rowData[0].movieid;
  conn.query(
    "delete from movie where movieID = ?",
    [movieid],
    (err, result) => {
      if (err) throw err;
      res.status(200).json({ affected_row: result.affectedRows });
    }
  );
});
router.delete("/:movieID", (req, res) => {
  const movieID = req.params.movieID;
  let sql = "DELETE FROM `movie` WHERE movieID=?";
  conn.query(sql, [movieID], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});
