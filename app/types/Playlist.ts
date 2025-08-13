import type { Track } from "./Track";
import type { User } from "./User";

export type Playlist = {
	id: string;
	name: string;
	relatedTo: User;
	tracks: Track[];
};
