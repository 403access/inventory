export const getHostFromHeader = (headers: Headers) => {
	return headers.get("host") || "localhost:3000";
};
