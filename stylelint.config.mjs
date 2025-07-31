/** @type {import('stylelint').Config} */
const config = {
	extends: ['stylelint-config-standard-scss'],
	rules: {
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'layer',
					'plugin',
					'custom-variant',
					'theme'
				]
			}
		],
		'scss/operator-no-unspaced': null,
		'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }]
	}
};

export default config;
