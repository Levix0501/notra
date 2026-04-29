import { ColoredContactIconSwitch } from '@/components/colored-contact-icon-switch';
import { ContactInfoSheet } from '@/components/contact-info-sheet';
import { DraggableContactInfoItems } from '@/components/draggable-contact-info-items';
import { DraggableNavItems } from '@/components/draggable-nav-items';
import { NavItemSheet } from '@/components/nav-item-sheet';
import {
	ContactInfoAddButton,
	NavItemAddButton
} from '@/components/tree-node-add-button';
import { TreeNodeDeleteDialog } from '@/components/tree-node-delete-dialog';
import {
	ContactInfoPublishButton,
	NavbarPublishButton
} from '@/components/tree-nodes-publish-button';
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { getTranslations } from '@/i18n';
import { BookService } from '@/services/book';

const t = getTranslations('app_dashboard_page');

export default async function Page() {
	const { data: navbarBook } = await BookService.getNavbarBook();
	const { data: contactInfoBook } = await BookService.getContactInfoBook();

	if (!navbarBook || !contactInfoBook) {
		return null;
	}

	return (
		<>
			<main className="container mx-auto grid gap-4 p-4 md:p-8 lg:grid-cols-2 xl:grid-cols-3">
				<Card className="max-w-md shadow-none">
					<CardHeader className="border-b">
						<CardTitle>{t.navbar}</CardTitle>
						<CardDescription>{t.configure_navbar}</CardDescription>
					</CardHeader>
					<CardContent className="h-72 px-2 md:px-3.5">
						<DraggableNavItems bookId={navbarBook.id} />
					</CardContent>
					<CardFooter className="justify-end gap-2 border-t">
						<NavItemAddButton bookId={navbarBook.id} />
						<NavbarPublishButton bookId={navbarBook.id} />
					</CardFooter>
				</Card>

				<Card className="max-w-md shadow-none">
					<CardHeader className="border-b">
						<CardTitle>{t.contact_info}</CardTitle>
						<CardDescription>{t.configure_contact_info}</CardDescription>
						<CardAction>
							<ColoredContactIconSwitch />
						</CardAction>
					</CardHeader>
					<CardContent className="h-72 px-2 md:px-3.5">
						<DraggableContactInfoItems bookId={contactInfoBook.id} />
					</CardContent>
					<CardFooter className="justify-end gap-2 border-t">
						<ContactInfoAddButton bookId={contactInfoBook.id} />
						<ContactInfoPublishButton bookId={contactInfoBook.id} />
					</CardFooter>
				</Card>
			</main>

			<NavItemSheet bookId={navbarBook.id} />
			<ContactInfoSheet bookId={contactInfoBook.id} />
			<TreeNodeDeleteDialog />
		</>
	);
}
