import { bearerSecurity, paginationParams } from "./schemas";
import { responses } from "./responses";

export const uuidPathParam = {
	name: "id",
	in: "path",
	required: true,
	schema: { type: "string", format: "uuid" },
};

export const standardReadResponses = {
	200: responses[200],
	401: responses[401],
	403: responses[403],
	404: responses[404],
};

export const standardWriteResponses = {
	201: responses[201],
	400: responses[400],
	401: responses[401],
	403: responses[403],
	500: responses[500],
};

export const standardMutationResponses = {
	200: responses[200],
	400: responses[400],
	401: responses[401],
	403: responses[403],
	404: responses[404],
	500: responses[500],
};

export { bearerSecurity, paginationParams };
