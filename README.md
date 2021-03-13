# NodeJS Service Recovery

Service recovery mechanism is, if some service goes down, other service would keep trying to reconnect.

In this example, if `authService` goes down, when some request to `userService` is made it tries to check auth for request, on failure given sepcific condition it would re-initiate it's authentication process with `authService` and keep the initial request to itself (`userService`) hanging untill it's able to reconnect to `authService` and validate request.


## Architecture

<img src="https://user-images.githubusercontent.com/6108922/111027876-49009a80-83f3-11eb-9f9d-e4f02e54d622.png" width="500px" />
