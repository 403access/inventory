export const corsMiddleware = (response: Response) => {
	response.headers.set("Access-Control-Allow-Origin", "*");
	response.headers.set(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, DELETE",
	);
	response.headers.set("Access-Control-Allow-Headers", "Content-Type");
	return response;
};
