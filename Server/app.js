const express = require("express");
const app = express();
const cors = require("cors");
const { Client } = require("pg");
const dbInfo = require("../DB/dbInfo");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/slide", (req, res) => {
  const dateStr = req.body.dateStr;
  const tomo_dateStr = req.body.tomo_dateStr;
  console.log(dateStr);
  console.log(tomo_dateStr);

  const client = new Client(dbInfo);
  client.connect();
  client.query(
    "select date, title from schedule where (date LIKE $1 or date LIKE $2)",
    [dateStr + "%", tomo_dateStr + "%"],
    (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        // console.log(result.rows[0])
        res.send(result);
      }
    }
  );
});

app.post("/reg", (req, res) => {
  const title = req.body.title;
  const day = req.body.day;
  const date = req.body.date;
  const cat = req.body.cat;
  const sts = req.body.sts;
  const refer = req.body.refer;

  const client = new Client(dbInfo);
  client.connect();
  //     INSERT INTO schedule
  // (date, date_no, day_id, title, category, state, refer)
  // VALUES ('2022-08-31 10:13',
  // case
  // when (select count(date) from schedule where date LIKE '%2022-08-31%') = 0 then (select coalesce(max(date_no), 1) from schedule where date LIKE '%2022-08-31%')
  // when (select count(date) from schedule where date LIKE '%2022-08-31%') > 0 then (select max(date_no) from schedule where date LIKE '%2022-08-31%') + 1
  // else 1
  // end,
  // 2, '3번째 테스트입니다', '테스트', '테스트중', '비고입니다3');
  console.log("date  " + date);
  console.log("day  " + day);
  console.log("title  " + title);
  console.log("category  " + cat);
  console.log("state  " + sts);
  console.log("refer  " + refer);
  console.log("%" + date.substr(0, 10) + "%");

  const query =
    'INSERT INTO public."schedule" (date, date_no, day_id, title, category, state, refer) VALUES ($1,case when (select count(date) from public."schedule" where date LIKE $2) = 0 then (select coalesce(max(date_no), 1) from public."schedule" where date LIKE $2) when (select count(date) from public."schedule" where date LIKE $2) > 0 then (select max(date_no) from public."schedule" where date LIKE $2) + 1 else 1 end, $3,$4 ,$5 , $6, $7) RETURNING date_no';
  client.query(
    query,
    [date, "%" + date.substr(0, 10) + "%", day, title, cat, sts, refer],
    (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.send(result.rows);
      }
    }
  );
});

app.post("/load", (req, res) => {
  const date = req.body.date;

  const client = new Client(dbInfo);
  client.connect();
  // client.query('SELECT * FROM public."schedule" where to_char(date, $1) = $2',['YYYY-MM-DD', date],(err, result)=>{
  //     res.send(result.rows);
  // })
  client.query(
    `SELECT title, date_no, day_id, date, state, category, refer FROM public."schedule" ORDER BY date, date_no`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.rowCount > 0) {
          res.send(result.rows);
        } else res.send("0");
      }
    }
  );
});
app.post("/del", (req, res) => {
  const title = req.body.title;
  const day = req.body.day;
  const date = req.body.date;
  const date_no = req.body.date_no;
  const cat = req.body.cat;
  const sts = req.body.sts;
  const refer = req.body.refer;

  const client = new Client(dbInfo);
  client.connect();
  client.query(
    'DELETE FROM public."schedule" WHERE title= $1 AND day_id = $2 AND date = $3 AND date_no = $4',
    [title, day, date, date_no],
    (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.send("OK");
      }
    }
  );
});

app.post("/mod", (req, res) => {
  const beforeTitle = req.body.beforeTitle;
  const title = req.body.title;
  const day = req.body.day;
  const date = req.body.date;
  const cat = req.body.cat;
  const sts = req.body.sts;
  const refer = req.body.refer;
  console.log("modeTitle  " + beforeTitle);
  console.log("title  " + title);
  console.log("day  " + day);
  console.log("date  " + date);
  console.log("cat  " + cat);
  console.log("sts  " + sts);
  console.log("refer  " + refer);
  const client = new Client(dbInfo);
  client.connect();
  client.query(
    'UPDATE public."schedule" SET title = $1, day_id = $2, date = $3,category = $4,state = $5,refer = $6 WHERE title = $7',
    [title, day, date, cat, sts, refer, beforeTitle],
    (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.send("OK");
      }
    }
  );
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Start Server On Port 3000");
});
