<template>
  <div class="not-found-container">
    <div class="error-code">404</div>
    <h1 class="error-message">页面未找到</h1>
    <p class="error-description">抱歉，您访问的页面不存在或已被移除</p>
    <button class="home-button" @click="() => push('/')">返回首页</button>
  </div>
</template>

<script setup lang="ts">
const {push} = useRouter()

</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 20px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-message {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.error-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  max-width: 400px;
}

.home-button {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #337ecc;
}
</style>