# NodeJS Service Recovery

Service recovery mechanism is, if some service goes down, other service would keep trying to reconnect.

In this example, if `authService` goes down, when some request to `userService` is made it tries to check auth for request, on failure given sepcific condition it would re-initiate it's authentication process with `authService` and keep the initial request to itself (`userService`) hanging untill it's able to reconnect to `authService` and validate request.

## Test

1. Run `authService`
2. Run `userService`
3. Verify `userService` has connected and has refreshed token after 10s
4. Kill `authService`
5. Make GET `/user/1` call on `userService` which will triger connection failure recovery
6. Bring `authService` back up
7. Observer `userService` reconnects and responds to original request on point 5

## Architecture

<img src="https://user-images.githubusercontent.com/6108922/111027876-49009a80-83f3-11eb-9f9d-e4f02e54d622.png" width="500px" />
