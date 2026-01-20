import type { Pinia } from 'pinia'

declare module '#app' {
    interface NuxtApp {
        $pinia: Pinia // 声明 $pinia 的类型为 Pinia
    }
}

export {}