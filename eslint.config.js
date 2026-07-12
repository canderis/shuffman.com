import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
	{
		ignores: ['node_modules/**', 'dist/**'],
	},
	eslint.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		plugins: {
			'@typescript-eslint': tseslint,
			import: importPlugin,
			'jsx-a11y': jsxA11y,
			prettier,
			react,
			'react-hooks': reactHooks,
			'unused-imports': unusedImports,
		},
		settings: {
			react: {
				version: 'detect',
			},
			'import/resolver': {
				typescript: {},
			},
		},
		rules: {
			...tseslint.configs.recommended.rules,
			...react.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			...jsxA11y.configs.recommended.rules,
			...eslintConfigPrettier.rules,
			'@typescript-eslint/consistent-type-imports': 'warn',
			'@typescript-eslint/no-empty-interface': 'warn',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-use-before-define': 'error',
			eqeqeq: 'error',
			'import/extensions': 'off',
			'import/no-named-as-default-member': 'off',
			'import/no-named-as-default': 'off',
			'import/no-unresolved': 'off',
			'import/order': [
				'warn',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
			'import/prefer-default-export': 'off',
			'jsx-a11y/click-events-have-key-events': 'off',
			'jsx-a11y/no-noninteractive-element-interactions': 'off',
			'no-console': 'off',
			'no-else-return': 'warn',
			'no-nested-ternary': 'off',
			'no-plusplus': 'off',
			'no-unused-vars': 'off',
			'no-use-before-define': 'off',
			'prettier/prettier': [
				'warn',
				{},
				{
					usePrettierrc: true,
				},
			],
			'react-hooks/exhaustive-deps': 'off',
			'react/display-name': 'off',
			'react/jsx-no-props-spreading': 'off',
			'react/no-unused-prop-types': 'warn',
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/self-closing-comp': 'warn',
			'react/no-multi-comp': 'off',
			camelcase: 'off',
			'unused-imports/no-unused-imports': 'warn',
		},
	},
];
