<template>
  <footer class="footer  border-t-solid border-1 border-#bdc3c7 mt-5">
    <!-- 移动端底部导航 - 小屏幕显示 -->
    <div class="md:hidden z-50 !bg-white fixed bottom-0 left-0 right-0">
      <div class="grid grid-cols-4">
        <button
            class="flex flex-col items-center justify-center py-3 text-(--color-text-primary) hover:text-(--color-btn-text) hover:bg-(--color-text-hover) transition-colors">
          <i class="hy-ico-shouye ic-16"/>
          <span class="text-xs mt-1">首页</span>
        </button>
        <button
            class="flex flex-col items-center justify-center py-3 text-(--color-text-primary) hover:text-(--color-btn-text) hover:bg-(--color-text-hover) transition-colors">
          <i class="hy-ico-tiku ic-16"/>
          <span class="text-xs mt-1">题库</span>
        </button>
        <button
            class="flex flex-col items-center justify-center py-3 text-(--color-text-primary) hover:text-(--color-btn-text) hover:bg-(--color-text-hover) transition-colors">
          <i class="hy-ico-wd ic-16"/>
          <span class="text-xs mt-1">文档</span>
        </button>
        <button
            class="flex flex-col items-center justify-center py-3 text-(--color-text-primary) hover:text-(--color-btn-text) hover:bg-(--color-text-hover) transition-colors">
          <i class="hy-ico-grzx ic-16"/>
          <span class="text-xs mt-1">我的</span>
        </button>
      </div>
    </div>

    <div class="container  mx-auto px-4 py-8 hidden md:block text-gray-300">
      <!-- 页脚主体 -->
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
        <div>
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b-solid  border-gray-800">创作赚钱</h3>
          <ul class="space-y-3">
            <li>
              <a href="/protocol/norms" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>创作规范</span>
              </a>
            </li>
            <li>
              <a href="/protocol/lecturer" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>签约讲师</span>
              </a>
            </li>
            <li>
              <a href="/protocol/income" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>收益说明</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b-solid  border-gray-800">免责声明</h3>
          <ul class="space-y-3">
            <li>
              <a href="/protocol/upload" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>上传声明</span>
              </a>
            </li>
            <li>
              <a href="/protocol/agreement" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>用户声明</span>
              </a>
            </li>
            <li>
              <a href="/protocol/copyright" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>版权声明</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b-solid  border-gray-800">协议与政策</h3>
          <ul class="space-y-3">
            <li>
              <a href="/protocol/private" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>隐私协议</span>
              </a>
            </li>
            <li>
              <a href="/protocol/member" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>会员权益</span>
              </a>
            </li>
            <li>
              <a href="/protocol/harmless" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>不可抗力免责</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b-solid  border-gray-800">反馈问题</h3>
          <ul class="space-y-3">
            <li>
              <a href="/protocol/feedback" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>使用故障</span>
              </a>
            </li>
            <li>
              <a href="/protocol/advice" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>功能改进</span>
              </a>
            </li>
            <li>
              <a href="/protocol/infringement" class="group flex items-center">
                <i class="hy-ico-djt ic-10 mx-1"/>
                <span>侵权举报</span>
              </a>
            </li>
          </ul>
        </div>
        <!-- 联系我们 -->
        <div>
          <h3 class="text-lg font-semibold mb-4 pb-2 border-b-solid  border-gray-800">联系我们</h3>
          <ul class="space-y-3 text-sm">
            <li class="flex space-x-4 text-xl">
              <!-- 微信 -->
              <div class="relative group">
                <i class="i-wx cursor-pointer"/>
                <div
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            w-38 h-38 hidden group-hover:block z-10">
                  <img src="~/assets/images/qrcode_for_gh.jpg" alt="微信二维码" class="w-full h-full object-cover ">
                </div>
              </div>
              <!-- QQ -->
              <div class="relative group">
                <i class="i-qq cursor-pointer"/>
                <div
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            w-38 h-38 hidden group-hover:block z-10">
                  <img src="~/assets/images/xcy_qrcode.png" alt="QQ二维码" class="w-full h-full object-cover ">
                </div>
              </div>
              <!-- 微博 -->
              <div class="relative group">
                <i class="i-wb cursor-pointer"/>
                <div
                    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            w-38 h-38 hidden group-hover:block z-10">
                  <img src="~/assets/images/qrcode_for_gh.jpg" alt="微博二维码" class="w-full h-full object-cover ">
                </div>
              </div>
            </li>
            <li class="flex items-start">
              <Icon name="mdi:email-edit-outline" class="text-gray-400 mt-1 mr-3 w-4 text-center"/>
              <span class="text-gray-400">rd@qthy.cc</span>
            </li>
            <li class="flex items-start">
              <Icon name="ep:iphone" class="text-gray-400 mt-1 mr-3 w-4 text-center"/>
              <span class="text-gray-400">188 0688 8608</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="pt-3 border-t-solid border-1 border-gray-800 text-center text-gray-400 text-sm">
        <a href="/" >© {{ new Date().getFullYear() }} 学次元 保留所有权利</a>
        <div class="mt-1 flex justify-center space-x-6 text-sm">
          <a a href="https://beian.miit.gov.cn" target="_blank" rel="noreferrer nofollow" class="mt-1">浙ICP备2022036331号</a>
          <p class="mt-1">浙公网安备 33112102000156号</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 页脚组件 - 包含网站导航、联系信息和版权声明
// 使用说明: 直接在App.vue或布局组件中引入使用即可
</script>

<style scoped>
.footer {
  background: linear-gradient(to bottom, #1a1a1a, #111);
}

.footer-container a {
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer a:hover {
  color: #6366f1;
  transform: translateY(-1px);
}

.footer-container .fa {
  width: 1.5rem;
}
</style>
