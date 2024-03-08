import bodyParser from "body-parser";
import express from "express";
import { router as movie } from './api/movie'
import{ router as person } from './api/person'
import { router as creator } from "./api/creator";
import { router as star } from "./api/star";
import { router as search } from "./api/search";
export const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());

app.use("/movie",movie);
app.use("/person",person);
app.use("/creator",creator);
app.use("/star",star);
app.use("/search",search);