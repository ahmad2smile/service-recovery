import express from "express";
import { json } from "body-parser";

const app = express();

const jsonParser = json();

app.get("/", (req, res) => {
    res.json({ hello: "world" });
});

app.get("/authenticate", (req, res) => {
    setTimeout(() => {
        res.json({ hello: "world" });
    }, 2000);
});

app.get("/refresh-token", (req, res) => {
    setTimeout(() => {
        res.json({ hello: "world" });
    }, 1000);
});

app.post("/verify-user", jsonParser, (req, res) => {
    setTimeout(() => {
        const payload = req.body;

        if (payload.token === "good-token") {
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false });
        }
    }, 1000);
});

const PORT = Number(process.argv[2]) || 3001;

app.listen(PORT, null as any, () => {
    console.log("==================================");
    console.log(`Listening on port: ${PORT}`);
    console.log("==================================");
});
