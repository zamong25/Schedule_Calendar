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

app.listen(process.env.PORT || 3000, () => {
  console.log("Start Server On Port 3000");
});
