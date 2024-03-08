import { conn, mysql, queryAsync } from "../dbconnect";
import express from "express";
import { Insertmovie } from "../model/movie";
export const router = express.Router();
//http://localhost:3000/movie/searchsome/tran
router.get("/", (req, res) => {
  const searchname = `%${req.query.searchname}%`;
  //   let sql =
  //     "SELECT movie.movieID ,movie.name,movie.online_date,star.personID,person.name,creator.personID,create.name FROM movie,star,person,creater WHERE movie.movieID =star.movieID AND star.personID = name LIKE ?";
                    const sql = `
                    SELECT  movie.movieID,
                    movie.name AS movie_title,
                    movie.online_date AS movie_year,
                    star.personID AS actor_id,
                    stars.name AS star_name,
                    creator.personID AS creators_id,
                    creators.name AS creators_name
                    FROM movie , star , person AS stars , creator, person  AS creators
                    WHERE movie.movieID = star.movieID
                    AND star.personID = stars.personID
                    AND movie.movieID = creator.movieID
                    AND creator.personID = creators.personID
                    AND movie.name LIKE  ?
                `;

  conn.query(sql, [searchname], (err, results: any[], fields) => {
    if (err) throw err;

    const moviesMap = new Map<number, any>();
    results.forEach((row: any) => {
      const movieId = row.movieID;

      if (!moviesMap.has(movieId)) {
        moviesMap.set(movieId, {
          movie_id: row.mid,
          movie_title: row.movie_title,
          movies_year: row.movie_year,
          actors: [],
          creators: [],
        });
      }

      const movie = moviesMap.get(movieId);

      const star = {
        star_id: row.star_id,
        star_name: row.star_name,
      };

      const creator = {
        creator_id: row.creator_id,
        creator_name: row.creator_name,
      };

      // เพิ่มเช็คว่านักแสดงหรือผู้กำกับซ้ำหรือไม่
      if (!movie.actors.find((a: any) => a.star_id === star.star_id)) {
        movie.actors.push(star);
      }

      if (
        !movie.creators.find((c: any) => c.creator_id === creator.creator_id)
      ) {
        movie.creators.push(creator);
      }
    });

    const jsonData = { movies: Array.from(moviesMap.values()) };
    res.json(jsonData);
  });
});


