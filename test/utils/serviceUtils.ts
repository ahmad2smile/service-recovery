import { ChildProcessWithoutNullStreams, spawn } from "child_process";

const errorHandler = (reject: (reason?: any) => void) => (error: Error) => {
	console.log(error.toString());
	reject(error);
};

export const buildService = (service: "authService" | "orderService" | "userService"): Promise<void> => {
	return new Promise((resolve, reject) => {
		const buildCmd = spawn("npm", ["run", "build", "--prefix", `../${service}`]);

		buildCmd.on("error", errorHandler(reject));
		buildCmd.stderr.on("error", errorHandler(reject));

		buildCmd.on("close", resolve);
	});
};

export const startService = (
	service: "authService" | "orderService" | "userService",
	port: number,
): Promise<ChildProcessWithoutNullStreams> => {
	return new Promise((resolve, reject) => {
		const startCmd = spawn("npm", ["run", "start", "--prefix", `../${service}`, "--", String(port)]);

		startCmd.on("error", errorHandler(reject));
		startCmd.stderr.on("error", errorHandler(reject));

		startCmd.stdout.on("data", (data: Buffer) => {
			if (data.toString().includes("Listening on port")) {
				console.log(`Running ${service}: ${data.toString()}`);
				resolve(startCmd);
			}
		});
	});
};
