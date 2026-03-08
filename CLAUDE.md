# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server (port 90 by default, uses .env.development)
pnpm dev

# Build for production (uses .env.production)
pnpm build:prod

# Build for development environment
pnpm build:dev

# Generate static site
pnpm generate

# Preview production build
pnpm preview

# Prepare Nuxt (run after installing dependencies)
pnpm postinstall
```

## Architecture Overview

### Framework & Stack
- **Nuxt.js 4.1.0** with Vue 3.5 and TypeScript 5.8
- **Package Manager**: pnpm 9.14.2
- **UI Library**: Element Plus 2.11 with SCSS
- **CSS Framework**: UnoCSS (atomic CSS with custom theme in `unocss.config.ts`)
- **State Management**: Pinia 3.0 with `pinia-plugin-persistedstate`
- **Icons**: Iconify via `@nuxt/icon`

### Project Structure Patterns

**File-based Routing**: Pages auto-generated from `app/pages/`. Dynamic routes use `[param].vue` convention.

**Custom Route Extension**: Additional routes defined in `app/router/remaining.ts` are merged via `app/router.options.ts`.

**SSR/CSR Configuration**: Route rules in `nuxt.config.ts` specify rendering mode:
- `/account/**`, `/qb/**`, `/order/**` → `{ ssr: false }` (client-side only)
- Public pages use SSR by default

**API Layer Pattern**: All API calls use the `useHttp` composable (`app/composables/useHttp.ts`):
```typescript
// API modules export functions using httpGet/httpPost
export const login = (data: UserLoginVO) => {
  return httpPost('login', '/member/auth/login', data)
}
```

**State Management Pattern**: Pinia stores use Composition API style with persistence:
```typescript
export const useAuthStore = defineStore('auth', () => {
  // State, getters (computed), actions (functions)
  return { isLogin, login, logout }
}, {
  persist: { paths: ['isLogin', 'loginForm'] }
})
```

### Authentication & Token Handling

**Dual Token Storage** (`app/composables/useToken.ts`):
- Access token: Stored in `localStorage` (client-only), used for API auth
- Refresh token: Stored in HTTP-only cookie (readable by server), used for token refresh

**Auto Token Refresh**: The `useHttp` composable automatically:
1. Detects 401 responses
2. Queues pending requests during refresh
3. Refreshes using `/member/auth/refresh-token`
4. Retries failed requests with new token
5. Logs out if refresh fails

**API Proxy**: All backend requests go through `/app-api/**` proxy configured in `nuxt.config.ts` nitro routeRules.

### HTTP Request Patterns

**useHttp Composable** (`app/composables/useHttp.ts`):
- Base URL: `/app-api/` (proxied to backend)
- Default headers: `appid: 'xueciyuan'`, `tenant-id: 1`, `Current-Site: 4`
- Timeout: 30 seconds
- Methods: `httpGet`, `httpPost`, `httpPut`, `httpDelete`, `httpUpload`, `httpDownload`
- Response handling: Business code 0 = success, 401 triggers refresh flow

**Server vs Client**: Use `import.meta.client` checks for browser-only APIs. Token retrieval works differently on server (from request headers) vs client (from localStorage).

### Styling Conventions

**UnoCSS**: Utility-first CSS with custom theme colors defined in `unocss.config.ts`:
- Primary: `#165DFF` (pri-50 through pri-900)
- Secondary: `#722ED1` (sec-50 through sec-900)
- Neutral: `neu-50` through `neu-900`
- CSS variables: `--color-bg-page`, `--color-nav-bg`, etc.

**Element Plus**: Imported with auto-import via `@element-plus/nuxt`. Style imports optimized in `build/vite/optimize.ts`.

**SCSS**: Global variables in `app/styles/variables.scss`, auto-imported via Vite config.

### i18n Structure

Translations in `i18n/locales/` (zh.ts, en.ts). Use `$t()` from `app/utils/lang.ts`:
```typescript
import { $t } from '~/utils/lang'
const message = $t('sys.apiTimeoutMessage')
```

### Component Conventions

**Auto-imports**: Components in `app/components/` auto-imported globally with `pathPrefix: false`.

**Global Modals**: Login/Register modals in `app/components/global/` controlled via `useModalStore`.

**Canvas/Images**: Heavy use of Fabric.js for canvas operations (image editing, poster generation). Plugin at `app/plugins/fabric.client.ts` ensures client-only loading.

### Important Dependencies

- **fabric**: Canvas library (SSR disabled, client-only plugin)
- **echarts**: Charts (tree-shaked imports)
- **html2canvas**: DOM to image conversion
- **jsPDF**: PDF generation
- **qrcode**: QR code generation/reading
- **crypto-js, jsencrypt, node-forge**: Encryption utilities
- **@zip.js/zip.js**: ZIP file handling

### Build Configuration

**Vite Optimizations**: Dependency pre-bundling list in `build/vite/optimize.ts` includes Element Plus component styles and common libraries.

**SSR Handling**: `fabric` is both transpiled and marked `noExternal` in Vite SSR config to prevent server-side parsing errors.

**Environment Variables**:
- `NUXT_BASE_URL`: Backend API base URL
- `NUXT_API_URL`: API prefix (default: `/app-api`)
- `NUXT_CAPTCHA_ENABLE`: Toggle captcha validation

### Type Definitions

Global types in `app/types/global.d.ts`:
- `Fn<T>`: Generic function type
- `Nullable<T>`, `ElRef<T>`, `Recordable<T>`: Utility types
- `PageResult<T>`, `Tree`, `PageParam`: Common data structures
- `IResponse<T>`: Standard API response wrapper
