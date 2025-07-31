export type ChildrenProps = {
	children: React.ReactNode;
};

export type Nullable<T> = T | null;

export type WrappedResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};
