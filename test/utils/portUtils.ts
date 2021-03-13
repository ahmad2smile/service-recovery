import { createServer } from "http";
import { exec } from "child_process";
import { ExecException } from "node:child_process";

const checkIfPortAvaible = (port: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		var server = createServer();

		server.on("error", (err) => server.close(() => reject(err)));

		server.on("listening", () => server.close(() => resolve()));

		server.listen(port);
	});
};

let startingPort = 2000;

// NOTE: Resolves to a port where next port is avaible too
export const getRandomPortAlongWithNextOne = async (): Promise<[number, number]> => {
	while (true) {
		try {
			await checkIfPortAvaible(startingPort);
			await checkIfPortAvaible(startingPort + 1);
			break;
		} catch (error) {
			console.log(`Port unsuccessfull: ${startingPort}`);

			startingPort += 2;
		}
	}

	// NOTE: User Service is epxecting authService to be on port + 1
	return [startingPort, startingPort + 1];
};

export const killProcessAtPort = (port: number): Promise<void> => {
	return new Promise((resolve, reject) => {
		exec(
			`netstat -tulnp 2>/dev/null | grep ${port} | awk '{ print $7 }' | grep -o '[0-9]*' | xargs kill`,
			(error: ExecException | null, stdout: string, stderr: string) => {
				if (error || stderr) {
					reject();
				} else {
					resolve();
				}
			},
		);
	});
};
