export const zh = {
	app_api: {
		unauthorized: '未授权'
	},
	app_dashboard_layout: {
		metadata_title: '工作台'
	},
	app_login_page: {
		metadata_title: '登录',
		card_title: '管理员登录',
		card_description: '首次登录会自动创建账户'
	},
	components_account_dropdown: {
		settings: '设置',
		logout: '退出登录'
	},
	components_analytics_form: {
		google_analytics_id: '谷歌分析 ID',
		update_analytics: '更新数据分析配置',
		update_loading: '更新中...',
		update_success: '更新成功！',
		update_error: '更新失败！'
	},
	components_book_index_page_view_tabs: {
		doc_view: '文档',
		card_view: '卡片',
		edit_index_page: '编辑首页',
		update: '更新',
		no_docs_found: '还没有文档',
		update_loading: '更新中...',
		update_success: '更新成功！',
		update_error: '更新失败！'
	},
	components_book_info_form: {
		name: '名称',
		slug: '路径',
		update: '更新',
		slug_exists: '路径已存在',
		update_loading: '更新中...',
		update_success: '更新成功！',
		update_error: '更新失败！'
	},
	components_book_settings_dialog: {
		book_info: '知识库信息'
	},
	components_book_sidebar_nav: {
		book_home: '知识库主页'
	},
	components_books_nav: {
		books: '知识库',
		settings: '设置',
		new_book: '新建知识库',
		delete: '删除',
		delete_book: '删除知识库',
		delete_book_description:
			'正在删除知识库 {name}，该操作不可逆，一旦操作成功，知识库下的所有内容将会删除。',
		confirm: '删除',
		cancel: '取消',
		delete_success: '删除成功！',
		delete_error: '删除失败！',
		delete_loading: '删除中...'
	},
	components_create_book_dialog: {
		new_book: '创建知识库',
		create: '创建',
		name_placeholder: '知识库名称',
		create_loading: '创建中...',
		create_success: '创建成功！',
		create_error: '创建失败！'
	},
	components_dashboard_sidebar_nav: {
		home: '主页'
	},
	components_global_settings_dialog: {
		site_settings: '站点设置',
		analytics_settings: '统计设置'
	},
	components_image_cropper: {
		re_select: '重新选择',
		cancel: '取消',
		crop: '裁剪',
		max_size: '图片尺寸不能超过 {size}MB',
		file_type_error: '图片类型应为 jpg/png'
	},
	components_index_page_doc_form: {
		index_title: '标题',
		index_description: '描述',
		main_action_text: '主按钮文本',
		main_action_url: '主按钮链接',
		is_main_new_tab: '主按钮链接在新标签页打开',
		sub_action_text: '次按钮文本',
		sub_action_url: '次按钮链接',
		is_sub_new_tab: '次按钮链接在新标签页打开'
	},
	components_index_page_doc_view: {
		no_index_title: '请输入标题',
		no_index_description: '请输入描述',
		no_main_action_text: '主按钮文本',
		no_sub_action_text: '次按钮文本'
	},
	components_login_form: {
		username_label: '用户名',
		password_label: '密码',
		login_button: '登录',
		username_required: '请输入用户名',
		password_min_length: '请输入至少6个字符的密码',
		login_error: '登录失败！'
	},
	components_notra_footer: {
		powered_by:
			'本网站由 <a href="https://notra.tech" target="_blank" class="font-bold hover:text-primary">Notra</a> 提供技术支持'
	},
	components_site_index_page_view_tabs: {
		doc_view: '文档',
		card_view: '卡片',
		edit_index_page: '编辑首页',
		update: '更新',
		no_docs_found: '还没有文档',
		update_loading: '更新中...',
		update_success: '更新成功！',
		update_error: '更新失败！'
	},
	components_site_settings_form: {
		title: '站点标题',
		description: '站点描述',
		description_placeholder: '网站的简短描述',
		logo: 'Logo',
		edit_logo: '编辑 Logo',
		dark_logo: '暗色 Logo (可选)',
		edit_dark_logo: '编辑暗色 Logo',
		copyright: '版权',
		copyright_placeholder: '示例：{year} Notra',
		copyright_description: '版权说明将显示：{value}',
		update: '更新',
		update_loading: '更新中...',
		update_success: '更新成功！',
		update_error: '更新失败！'
	},
	components_theme_changer: {
		toggle_theme: '切换主题',
		light: '亮色',
		dark: '暗色',
		system: '系统'
	},
	services_account: {
		get_account_error: '获取账户失败！',
		create_account_error: '创建账户失败！',
		login_error: '登录失败'
	},
	services_book: {
		create_book_error: '创建知识库失败',
		get_books_error: '获取知识库失败',
		delete_book_error: '删除知识库失败',
		get_book_error: '获取知识库失败',
		check_book_slug_error: '检查知识库路径是否可用失败',
		update_book_error: '更新知识库失败'
	},
	services_file: {
		upload_error: '上传文件失败'
	},
	services_site_settings: {
		get_site_settings_error: '获取站点设置失败',
		update_site_settings_error: '更新站点设置失败'
	},
	types_book: {
		name_required: '名称是必填项',
		slug_required: '路径是必填项',
		slug_invalid: '非法路径'
	}
};
