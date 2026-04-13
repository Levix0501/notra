import { CommentWithReplies } from '@/types/comment';

const DEMO_COMMENTS_KEY = 'notra_demo_comments';

type DemoCommentsMap = Record<string, CommentWithReplies[]>;

function readStore(): DemoCommentsMap {
	if (typeof window === 'undefined') {
		return {};
	}

	const raw = window.localStorage.getItem(DEMO_COMMENTS_KEY);

	if (!raw) {
		return {};
	}

	try {
		return JSON.parse(raw) as DemoCommentsMap;
	} catch {
		return {};
	}
}

function writeStore(store: DemoCommentsMap) {
	if (typeof window === 'undefined') {
		return;
	}

	window.localStorage.setItem(DEMO_COMMENTS_KEY, JSON.stringify(store));
}

export function getDemoComments(docId: number): CommentWithReplies[] {
	const store = readStore();

	return store[String(docId)] ?? [];
}

export function setDemoComments(docId: number, comments: CommentWithReplies[]) {
	const store = readStore();

	store[String(docId)] = comments;
	writeStore(store);
}
