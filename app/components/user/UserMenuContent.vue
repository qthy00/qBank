<template>
  <el-menu-item index="/account/profile">
    <Icon name="ep:user" class="mr-1" />
    <span>个人信息</span>
  </el-menu-item>
  <el-menu-item index="/account/messages">
    <Icon name="ep:bell" class="mr-1" />
    <template #title>
      <span>消息中心</span>
      <el-badge
        v-if="notificationStore.unreadCount > 0"
        :value="notificationStore.unreadCount"
        :max="99"
        class="ml-2"
      />
    </template>
  </el-menu-item>
  <el-menu-item index="/account/mistakes">
    <Icon name="arcticons:androits-gps-test" class="mr-1" />
    <span>我的错题</span>
  </el-menu-item>
  <el-menu-item index="/account/statistics">
    <Icon name="ep:data-analysis" class="mr-1" />
    <span>学习统计</span>
  </el-menu-item>
  <el-menu-item index="/account/report">
    <Icon name="ep:medal" class="mr-1" />
    <span>能力评估</span>
  </el-menu-item>
  <el-menu-item index="/account/favorites">
    <Icon name="ep:star" class="mr-1" />
    <span>个人收藏</span>
  </el-menu-item>
  <el-menu-item index="/account/orders">
    <Icon name="ep:shopping-bag" class="mr-1" />
    <span>订单管理</span>
  </el-menu-item>
  <el-menu-item index="/account/activation">
    <Icon name="mdi:code-tags-check" class="mr-1"/>
    <span>激活码</span>
  </el-menu-item>
  <el-divider />
  <el-menu-item index="/account/security">
    <Icon name="ep:lock" class="mr-1" />
    <span>账户安全</span>
  </el-menu-item>
<!--  <el-menu-item index="/account/complaints">-->
<!--    <Icon name="ep:message" class="mr-1" />-->
<!--    <span>投诉举报</span>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/account/settings">-->
<!--    <Icon name="ep:setting" class="mr-1" />-->
<!--    <span>设置协议</span>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/account/support">-->
<!--    <Icon name="ep:warning" class="mr-1" />-->
<!--    <span>帮助与客服</span>-->
<!--  </el-menu-item>-->
<!--  <el-menu-item index="/account/create">-->
<!--    <Icon name="ep:document" class="mr-1" />-->
<!--    <span>投稿列表</span>-->
<!--  </el-menu-item>-->
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'

const notificationStore = useNotificationStore()
</script>