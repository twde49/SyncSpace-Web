import type { User } from "./User";

export type PasswordItem = {
	"@id": number;
	"@type": "PasswordItem";
	id: number;
	url?: string;
	name?: string;
	email?: string;
	passwordEncrypted: string;
	notesEncrypted?: string;
	iv: string;
	isFavorite?: boolean;
	associatedTo?: User;
	mustBeUpdated?: boolean;
	createdAt?: string;
};
