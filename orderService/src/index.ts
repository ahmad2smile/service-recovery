import express from "express";

const app = express();

app.use("/", (req, res) => {
    res.json({ hello: "world" });
});

const PORT = Number(process.argv[2]) || 3002;

app.listen(PORT, null as any, () => {
    console.log("==================================");
    console.log(`Listening on port: ${PORT}`);
    console.log("==================================");
});
