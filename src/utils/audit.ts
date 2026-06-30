import database_models from "../database/config/db.config";

export const createAuditLog = async (params: {
	actorId?: string | null;
	action: string;
	entityType: string;
	entityId?: string | null;
	description: string;
	metadata?: Record<string, unknown>;
}) => {
	await database_models.AuditLog.create({
		actorId: params.actorId ?? null,
		action: params.action,
		entityType: params.entityType,
		entityId: params.entityId ?? null,
		description: params.description,
		metadata: params.metadata ?? null,
	});
};

export const formatActorName = (firstName?: string, lastName?: string) => {
	if (!firstName && !lastName) return "System";
	return `${firstName ?? ""} ${lastName ?? ""}`.trim();
};
