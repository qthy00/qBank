// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here

    {
        rules: {
            // 禁用显式 any 检查（解决你的核心需求）
            '@typescript-eslint/no-explicit-any': 'off',
            // 可选：禁用隐式 any 检查
            '@typescript-eslint/no-implicit-any': 'off',
        },
    }
)
