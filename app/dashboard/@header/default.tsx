import { NavbarStatic } from '@/components/navbar-static';
import { NavbarStaticMobileButton } from '@/components/navbar-static-mobile';
import { TreeNodeService } from '@/services/tree-node';

export default async function Default() {
	const { data: navItems } = await TreeNodeService.getPublishedNavItems();

	return (
		<>
			<div className="h-full flex-1">
				<NavbarStatic />
			</div>
			<div className="flex h-full items-center gap-1">
				{navItems && navItems.length > 0 && (
					<NavbarStaticMobileButton navItems={navItems} />
				)}
			</div>
		</>
	);
}
