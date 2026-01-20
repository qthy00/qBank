import * as fabric from 'fabric';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('fabric', fabric);
});