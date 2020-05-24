module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    'prettier',
    'prettier/vue'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    "standard/computed-property-even-spacing": 0
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
