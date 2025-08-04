import type { Conversation } from "~/types/Conversation";
import type { User } from "~/types/User";
export type Message = {
	"@id": number;
	"@type": "Message";
	id: number;
	content?: string;
	type?: string;
	sentAt?: Date;
	isRead?: boolean;
	sender?: User;
	attachment?: string;
	isDeleted?: boolean;
	conversation?: Conversation;
};
