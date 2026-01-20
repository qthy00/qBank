<script setup lang="ts">

import {ArticleApi} from "~/api/article";

definePageMeta({
  layout: 'protocol'
})

// 响应式状态
const loading: Ref<boolean> = ref(true); // 加载状态
const error: Ref<boolean> = ref(false); // 异常状态
const {params} = useRoute()


const protocolInfo = {
  'advice': {id: 755705061974085, name: '改进建议'},
  'feedback': {id: 755705061900357, name: '故障反馈'},
  'infringement': {id: 755705061748805, name: '侵权举报'},
  'income': {id: 755705270411333, name: '创作收益'},
  'lecturer': {id: 755705270472773, name: '签约讲师'},
  'norms': {id: 755705270321221, name: '创作规范'},
  'certification': {id: 755705238003781, name: '实名认证'},
  'upload': {id: 755705237667909, name: '上传声明'},
  'private': {id: 755705237938245, name: '隐私协议'},
  'harmless': {id: 755705237872709, name: '不可抗力'},
  'copyright': {id: 755705237811269, name: '版权声明'},
  'agreement': {id: 755705237745733, name: '用户协议'},
  'member': {id: 755705237508165, name: '会员权益'},
}




const {data} = await ArticleApi.getArticleDetail(protocolInfo[params.type]?.id, true);

useHead({
  title: protocolInfo[params.type]?.name
})


</script>

<template>
  <div class="protocol-container max-w-4xl mt-8 mx-4 md:mx-8 bg-white">
    <!-- 富文本内容展示 -->

    <!-- 创作规范 -->
    <div class="text-wrap p-6 px-4 py-8 md:px-8" v-if="data?.contentHtml">
      <h1 class="text-3xl font-bold text-center mb-8 py-6">{{ data?.title }}</h1>
      <div class="container-content p-4">
        <div class="protocol-content"
             v-html="data?.contentHtml"
        ></div>
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

  & p{
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

  & ul, & ul li {
    list-style-type: disc !important;
  }

  & ol, & ol li {
    list-style-type: decimal !important;
  }

  & li {
    text-align: justify;
    line-height: 1.5;
  }

  & a {
    color: #409EFFFF;
    text-decoration: underline;

    &:hover {
      color: #79BBFFFF;
    }
  }

  & table{
    border: 1px solid #E7E2DFFF;
    display: table;
    font-size: 0.875rem;
    position: relative;
    width: 100%;
    border-radius: 0.5rem;
    text-align: left;
    text-indent: 0;
    border-collapse: collapse;
  }

  & th{
    border: 1px solid #E7E2DFFF;
    height: 40px;
    text-align: center;
  }

  & td{
    background-color: #F8F8F8FF;
    border: 1px solid #E7E2DFFF;
    padding: 8px;
    align-items: center;
  }



}
</style>