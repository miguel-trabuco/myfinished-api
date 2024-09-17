import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
	{
		'rules': {
			'quotes': ['error', 'single'],
			'indent': ['error', 'tab'],
			'semi': ['error', 'always'],
			'eol-last': ['error', 'always']
		}
	},
	{files: ['**/*.{mjs,cjs,ts}']},
	{languageOptions: { globals: globals.browser }},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
