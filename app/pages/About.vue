<script setup lang="ts">

import {ArticleApi} from "~/api/article";

definePageMeta({
  layout: 'protocol'
})

useHead({
  title: '关于我们'
})

// 响应式状态
const loading: Ref<boolean> = ref(true); // 加载状态
const error: Ref<boolean> = ref(false); // 异常状态
const {data} = await ArticleApi.getArticleDetail(755705198661701, true);

</script>

<template>
  <div class="protocol-container max-w-4xl mt-8 mx-4 md:mx-8 bg-white">
    <!-- 富文本内容展示 -->

    <!-- 创作规范 -->
    <div v-if="data?.contentHtml" class="text-wrap p-6 px-4 py-8 md:px-8">
      <h1 class="text-3xl font-bold text-center mb-8 py-6">{{ data?.title }}</h1>
      <div class="container-content p-4">
        <div
class="protocol-content"
            v-html="data?.contentHtml"
        />
      </div>
    </div>

    <!-- 异常提示 -->
    <el-empty
        v-else
        description="暂无内容"
        class="py-12"
    >
      <el-button type="primary" @click="navigateTo('/')">返回首页</el-button>
    </el-empty>
  </div>
</template>

<style lang="scss">
.protocol-container {
  min-height: calc(100vh - 100px); /* 适配布局，可根据实际调整 */
}

/* 富文本样式优化（配合UnoCSS prose类） */
.protocol-content {
  & h1, h2, h3, h4 {
    margin: 1.5rem 0 1rem 0;
    font-weight: 600;
  }

  & p {
    margin-bottom: 1.5rem;
    text-align: justify;
    line-height: 2;
  }

  & img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
  }

  & ul, ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
  }

  & a {
    color: var(--el-color-primary);
    text-decoration: underline;

    &:hover {
      color: var(--el-color-primary-light-3);
    }
  }
}
</style>