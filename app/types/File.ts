import type { User } from "./User";

export type File = {
	"@id": number;
	"@type": "File";
	id: number;
	filename: string;
	filepath: string;
	size: number | null;
	mimeType: string;
	uploadedAt: string;
	owner: User;
	sharedWith: User[];
	originalName: string | null;
	isFolder: boolean;
	parent: File | null;
};
