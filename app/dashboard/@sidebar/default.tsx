import { BooksNav } from '@/components/books-nav';
import { DashboardSidebarNav } from '@/components/dashboard-sidebar-nav';

export default function Default() {
	return (
		<>
			<DashboardSidebarNav />
			<BooksNav />
		</>
	);
}
