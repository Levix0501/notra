'use client';

import { DocEntity } from '@prisma/client';
import { useEffect } from 'react';

import { incrementViewCount } from '@/actions/doc';

interface ViewCountUpdaterProps {
	docId: DocEntity['id'];
}

export const ViewCountUpdater = ({
	docId
}: Readonly<ViewCountUpdaterProps>) => {
	useEffect(() => {
		incrementViewCount(docId);
	}, [docId]);

	return null;
};
