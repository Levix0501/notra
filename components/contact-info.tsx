import { CONTACT_INFO_ICONS } from '@/constants/contact';
import { SiteSettingsService } from '@/services/site-settings';
import { TreeNodeService } from '@/services/tree-node';

import { ContactInfoIcon } from './contact-info-icon';
import { ContactInfoItemWrapper } from './contact-info-item';

export async function ContactInfo() {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const { data } = await TreeNodeService.getPublishedContactInfo();

	if (!data) {
		return null;
	}

	const items = data
		.map((item) => ({
			...item,
			icon: CONTACT_INFO_ICONS.find((icon) => icon.slug === item.icon)
		}))
		.filter((item) => item.icon !== undefined);

	return (
		<div className="flex flex-initial flex-row items-center justify-start gap-3">
			{items.map((item) => (
				<ContactInfoItemWrapper key={item.id} url={item.url}>
					<ContactInfoIcon
						colored={Boolean(siteSettings?.coloredContactIcons)}
						darkInvert={item.icon?.darkInvert ?? false}
						hex={item.icon?.hex ?? ''}
						svg={item.icon?.svg ?? ''}
					/>
				</ContactInfoItemWrapper>
			))}
		</div>
	);
}
