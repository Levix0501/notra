'use client';

import { createContext, useContext, ReactNode } from 'react';

interface AppContextType {
	isDemo: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
	children,
	isDemo
}: {
	children: ReactNode;
	isDemo: boolean;
}) {
	return (
		<AppContext.Provider value={{ isDemo }}>{children}</AppContext.Provider>
	);
}

export function useApp() {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error('useApp must be used within AppProvider');
	}

	return context;
}
