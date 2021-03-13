import express from "express";
import axios from "axios";
import { Controller } from "./controller";
import { Auth } from "./auth";
import { sleepAsync } from "./utils";

const app = express();

const instance = axios.create({
    baseURL: "http://localhost:3001",
});

const auth = new Auth(instance);
auth.authenticateSelf();

let retryingConnection = false;

instance.interceptors.response.use(null as any, (error) => {
    if (error.code === "ECONNREFUSED" && error.config && !retryingConnection) {
        retryingConnection = true;
        return sleepAsync(1000).then(() => {
            return auth.authenticateSelf().then(() => {
                retryingConnection = false;
                return instance.request(error.config);
            });
        });
    }

    return Promise.reject(error);
});

const controller = new Controller(instance, auth);

app.use("/user/:id", controller.getById);

app.use("/", (req, res) => {
    res.json({ hello: "world" });
});

app.listen(3000);
