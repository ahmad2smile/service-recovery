import { AxiosInstance } from "axios";
import { Request, Response } from "express";
import { Auth } from "./auth";

export class Controller {
    constructor(private _axios: AxiosInstance, private _auth: Auth) {
        this.getById = this.getById.bind(this);
    }

    async getById(req: Request, res: Response): Promise<void> {
        const result = await this._auth.verifyUserToken("good-token");

        console.log("==================================");
        console.log(JSON.stringify({ isAuth: result }, undefined, 4));
        console.log("==================================");

        res.json({ user: `user ${req.params.id}` });
    }
}
