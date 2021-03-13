# NodeJS Service Recovery

Service recovery mechanism is, if some service goes down, other service would keep trying to reconnect.

In this example, if `authService` goes down, when some request to `userService` is made it tries to check auth for request, on failure given sepcific condition it would re-initiate it's authentication process with `authService` and keep the initial request to itself (`userService`) hanging untill it's able to reconnect to `authService` and validate request.
