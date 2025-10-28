import { NavItemAddButton } from '@/components/nav-item-add-button';
import { NavItemDeleteDialog } from '@/components/nav-item-delete-dialog';
import { NavItemSheet } from '@/components/nav-item-sheet';
import { Navbar } from '@/components/navbar';
import { NavbarPublishButton } from '@/components/navbar-publish-button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { getTranslations } from '@/i18n';
import { BookService } from '@/services/book';

const t = getTranslations('app_dashboard_main_page');

export default async function Page() {
	const navbarBookResult = await BookService.getNavbarBook();

	if (!navbarBookResult.data) {
		return null;
	}

	return (
		<main className="container mx-auto p-4 md:p-8">
			<Card className="max-w-md shadow-none">
				<CardHeader className="border-b">
					<CardTitle>{t.navbar}</CardTitle>
					<CardDescription>{t.configure_navbar}</CardDescription>
				</CardHeader>
				<CardContent className="h-[360px] px-2 md:px-3.5">
					<Navbar bookId={navbarBookResult.data.id} />
				</CardContent>
				<CardFooter className="justify-end gap-2 border-t">
					<NavItemAddButton />
					<NavbarPublishButton bookId={navbarBookResult.data.id} />
				</CardFooter>
			</Card>

			<NavItemSheet bookId={navbarBookResult.data.id} />
			<NavItemDeleteDialog bookId={navbarBookResult.data.id} />
		</main>
	);
}
