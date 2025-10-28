import { DocService } from '@/services/doc';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const result = await DocService.getPublishedBlog(Number(id));

	return result.nextResponse();
}
