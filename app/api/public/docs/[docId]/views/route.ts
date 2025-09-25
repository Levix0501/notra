import DocService from "@/services/doc";

export async function GET(_: Request, { params }: { params: Promise<{ docId: string }> }) {
	const { docId } = await params;
	const result = await DocService.getPublishedDocViews(Number(docId));

	return result.nextResponse();
}