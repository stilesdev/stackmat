/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
    ],
    env: {
        'vue/setup-compiler-macros': true,
    },
    rules: {
        'comma-dangle': ['error', 'always-multiline'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'vue/component-name-in-template-casing': [
            'error',
            'PascalCase',
            { registeredComponentsOnly: false },
        ],
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': [
            'error',
            { singleline: 1, multiline: 1 },
        ],
        'vue/no-v-for-template-key': 'off',
        'vue/no-v-model-argument': 'off',
        'vue/script-indent': ['error', 4],
    },
}
