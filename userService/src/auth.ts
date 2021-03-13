import { AxiosInstance } from "axios";
import { sleepAsync } from "./utils";

export class Auth {
    constructor(private _axios: AxiosInstance) {}

    async authenticateSelf(): Promise<void> {
        try {
            await this._axios.get("/authenticate");
            console.log("Authenticated service");

            this.refreshToken();
        } catch (error) {
            console.log("Service Auth failed");
        }
    }

    async refreshToken(): Promise<void> {
        try {
            await sleepAsync(10000);

            await this._axios.get("/refresh-token");

            console.log("Token Refreshed");
            await this.refreshToken();
        } catch (error) {
            console.log("Refreshing Token failed");
        }
    }

    async verifyUserToken(token: string): Promise<boolean> {
        const response = await this._axios.post("/verify-user", {
            token,
        });

        return response.data.success;
    }
}
