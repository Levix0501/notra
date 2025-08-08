export const en = {
	app_api: {
		unauthorized: 'Unauthorized'
	},
	app_dashboard_layout: {
		metadata_title: 'Dashboard'
	},
	app_login_page: {
		metadata_title: 'Login',
		card_title: 'Admin Login',
		card_description: 'An account will be created on first login.'
	},
	components_account_dropdown: {
		settings: 'Settings',
		logout: 'Logout'
	},
	components_analytics_form: {
		google_analytics_id: 'Google Analytics ID',
		update_analytics: 'Update Analytics',
		update_loading: 'Updating...',
		update_success: 'Updated successfully!',
		update_error: 'Failed to update!'
	},
	components_book_index_page_view_tabs: {
		doc_view: 'Doc',
		card_view: 'Card',
		edit_index_page: 'Edit Index Page',
		update: 'Update',
		no_docs_found: 'No docs found',
		update_loading: 'Updating...',
		update_success: 'Updated successfully!',
		update_error: 'Failed to update!'
	},
	components_book_info_form: {
		name: 'Name',
		slug: 'Slug',
		update: 'Update',
		slug_exists: 'Slug already exists',
		update_loading: 'Updating book...',
		update_success: 'Updated successfully!',
		update_error: 'Failed to update!'
	},
	components_book_settings_dialog: {
		book_info: 'Book Info'
	},
	components_book_sidebar_nav: {
		book_home: 'Book Home'
	},
	components_books_nav: {
		books: 'Books',
		settings: 'Settings',
		new_book: 'New Book',
		delete: 'Delete',
		delete_book: 'Delete Book',
		delete_book_description:
			'Deleting book {name}. This action cannot be undone. All content under the book will be deleted.',
		confirm: 'Delete',
		cancel: 'Cancel',
		delete_success: 'Deleted successfully!',
		delete_error: 'Failed to delete!',
		delete_loading: 'Deleting...'
	},
	components_create_book_dialog: {
		new_book: 'New Book',
		create: 'Create',
		name_placeholder: 'Name',
		create_loading: 'Creating a new book...',
		create_success: 'Created successfully!',
		create_error: 'Failed to create!'
	},
	components_create_dropdown: {
		new_document: 'Document',
		new_stack: 'Stack',
		create_stack_error: 'Failed to create stack!'
	},
	components_dashboard_sidebar_nav: {
		home: 'Home'
	},
	components_global_settings_dialog: {
		site_settings: 'Site Settings',
		analytics_settings: 'Analytics Settings'
	},
	components_image_cropper: {
		re_select: 'Re-select',
		cancel: 'Cancel',
		crop: 'Crop',
		max_size: 'Image size should be less than {size}MB',
		file_type_error: 'Image type should be jpg/png'
	},
	components_index_page_doc_form: {
		index_title: 'Title',
		index_description: 'Description',
		main_action_text: 'Main Action Text',
		main_action_url: 'Main Action URL',
		is_main_new_tab: 'Open Main Action URL in new tab',
		sub_action_text: 'Sub Action Text',
		sub_action_url: 'Sub Action URL',
		is_sub_new_tab: 'Open Sub Action URL in new tab'
	},
	components_index_page_doc_view: {
		no_index_title: 'Please enter a title',
		no_index_description: 'Please enter a description',
		no_main_action_text: 'Main Action Text',
		no_sub_action_text: 'Sub Action Text'
	},
	components_login_form: {
		username_label: 'Username',
		password_label: 'Password',
		login_button: 'Login',
		username_required: 'Username is required.',
		password_min_length: 'Password must be at least 6 characters.',
		login_error: 'Login failed!'
	},
	components_notra_footer: {
		powered_by:
			'Powered by <a href="https://notra.tech" target="_blank" class="font-bold hover:text-primary">Notra</a>'
	},
	components_site_index_page_view_tabs: {
		doc_view: 'Doc',
		card_view: 'Card',
		edit_index_page: 'Edit Index Page',
		update: 'Update',
		no_docs_found: 'No docs found',
		update_loading: 'Updating...',
		update_success: 'Updated successfully!',
		update_error: 'Failed to update!'
	},
	components_site_settings_form: {
		title: 'Site Title',
		description: 'Site Description',
		description_placeholder: 'A brief description of your website',
		logo: 'Logo',
		edit_logo: 'Edit Logo',
		dark_logo: 'Dark Logo (Optional)',
		edit_dark_logo: 'Edit Dark Logo',
		copyright: 'Copyright',
		copyright_placeholder: 'eg. {year} Notra',
		copyright_description: 'Copyright will be displayed: {value}',
		update: 'Update',
		update_loading: 'Updating...',
		update_success: 'Updated successfully!',
		update_error: 'Failed to update!'
	},
	components_theme_changer: {
		toggle_theme: 'Toggle theme',
		light: 'Light',
		dark: 'Dark',
		system: 'System'
	},
	services_account: {
		get_account_error: 'Failed to get account!',
		create_account_error: 'Failed to create account!',
		login_error: 'Failed to login!'
	},
	services_book: {
		create_book_error: 'Failed to create book!',
		get_books_error: 'Failed to get books!',
		delete_book_error: 'Failed to delete book!',
		get_book_error: 'Failed to get book!',
		check_book_slug_error: 'Failed to check book slug!',
		update_book_error: 'Failed to update book!'
	},
	services_catalog_node: {
		get_catalog_nodes_error: 'Failed to get nodes!',
		new_stack_default_name: 'Stack',
		new_doc_default_name: 'Untitled Document',
		create_stack_error: 'Failed to create stack!',
		create_doc_error: 'Failed to create document!',
		delete_with_children_error: 'Failed to delete!',
		prepend_child_error: 'Failed to prepend child!',
		move_after_error: 'Failed to move after!',
		update_title_error: 'Failed to update title!'
	},
	services_file: {
		upload_error: 'Failed to upload file!'
	},
	services_site_settings: {
		get_site_settings_error: 'Failed to get site settings',
		update_site_settings_error: 'Failed to update site settings'
	},
	types_book: {
		name_required: 'Name is required',
		slug_required: 'Slug is required',
		slug_invalid: 'Slug is invalid'
	}
};
