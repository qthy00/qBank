<!-- API使用说明弹窗 -->
<template>
  <div class="api-docs-modal">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">API文档说明</h3>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>
      <div class="modal-body">
        <div class="content-scroll" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiDocsModal',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.api-docs-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 16px;
}

.content-scroll {
  max-height: calc(80vh - 100px);
  overflow-y: auto;
  line-height: 1.6;
}

/* 表格样式支持 */
.content-scroll table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.content-scroll th,
.content-scroll td {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.content-scroll th {
  background-color: #f3f4f6;
  font-weight: 600;
}

.content-scroll tr:nth-child(even) {
  background-color: #f9fafb;
}
</style>