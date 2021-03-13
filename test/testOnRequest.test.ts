import axios from "axios";
import { getRandomPortAlongWithNextOne, killProcessAtPort } from "./utils/portUtils";

jest.setTimeout(60_0_000);

import { buildService, startService } from "./utils/serviceUtils";

describe("service recovery", () => {
	beforeAll(async () => {
		await buildService("authService");
		await buildService("userService");
	});

	test("services run success", async () => {
		const [userPort, authPort] = await getRandomPortAlongWithNextOne();

		const authServiceProc = await startService("authService", authPort);
		const userServiceProc = await startService("userService", userPort);

		const authServiceInstance = axios.create({
			baseURL: `http://localhost:${authPort}`,
		});
		const userServiceInstance = axios.create({
			baseURL: `http://localhost:${userPort}`,
		});

		const authRes = await authServiceInstance.get("/");
		const userRes = await userServiceInstance.get("/");

		authServiceProc.kill("SIGINT");
		userServiceProc.kill("SIGINT");
		await killProcessAtPort(authPort);
		await killProcessAtPort(userPort);

		expect(authRes.data).toEqual({ hello: "world" });
		expect(userRes.data).toEqual({ hello: "world" });
	});

	// TODO: Failing test, error: `socket hang up`
	test("userService reconnects after authService recovery", async () => {
		const [userPort, authPort] = await getRandomPortAlongWithNextOne();

		let authServiceProc = await startService("authService", authPort);
		const userServiceProc = await startService("userService", userPort);

		const authKilled = authServiceProc.kill("SIGHUP");
		await killProcessAtPort(authPort);
		expect(authKilled).toBe(true);

		const userServiceInstance = axios.create({
			baseURL: `http://localhost:${userPort}`,
		});

		await new Promise<void>(async (resolve) => {
			userServiceInstance.get("/user/1").then((res) => {
				const userRes = res.data;

				expect(userRes).toEqual({ user: "user 1" });

				resolve();
			});

			authServiceProc = await startService("authService", authPort);

			authServiceProc.kill("SIGINT");
			userServiceProc.kill("SIGINT");
			await killProcessAtPort(userPort);
			await killProcessAtPort(authPort);

			expect(authServiceProc).toBeTruthy();
		});
	});
});
