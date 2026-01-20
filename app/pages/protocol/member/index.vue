<script setup lang="ts">

definePageMeta({
  layout: 'protocol'
})

useHead({
  title: '会员权益'
})


</script>

<template>
  <div class="protocol-container max-w-4xl mt-8 mx-4 md:mx-8 bg-white">
    <div class="flex gap-6 items-start">

      <div class="text-wrap p-6 ">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold text-center mb-8">会员权益说明</h1>
          <br>
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">一、会员类型与定义</h2>
            <p class="text-lg indent-8">
              本平台为用户提供 <a href="#" class="text-blue"><strong>超级VIP会员</strong></a> 与
              <a href="#" class="text-success"><strong>单一专业VIP会员</strong></a>
              两种权益服务，旨在满足不同用户的学习与使用需求。用户可根据自身实际需求，选择相应会员类型并完成支付后，即可享受对应权益。
            </p>
          </div>

          <br>
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">二、超级VIP会员权益</h2>
            <div class="mb-4">
              <h3 class="text-xl font-bold mb-2">（一）全科目学习资源畅享</h3>
              <p class="text-lg indent-8">
                开通超级VIP会员后，您将获得全平台所有考试类型的完整学习权限，可自由使用章节练习、历年真题、模拟考试等全部学习资源。无论是职业资格类、升学考试类，还是技能认证类等各类考试内容，均对您开放，且不受时间与次数限制，助您全方位、系统化地进行学习备考。
              </p>
            </div>
            <div class="mb-4">
              <h3 class="text-xl font-bold mb-2">（二）专属赠送权益</h3>
              <div class="mb-2">
                <p class="text-lg">
                  <strong>文档下载卷</strong>：根据您购买超级VIP会员的支付金额，将赠送相应数量的文档下载卷。支付金额越高，赠送的下载卷数量越多。具体赠送规则如下：
                </p>
                <ul class="list-none pl-8 text-lg">
                  <li>月度超级VIP会员：赠送 <strong>100</strong> 张文档下载卷；</li>
                  <li>季度超级VIP会员：赠送 <strong>100 * 3</strong> 张文档下载卷；</li>
                  <li>年度超级VIP会员：赠送 <strong>100 * 12</strong> 张文档下载卷。</li>
                </ul>
              </div>
              <div class="mb-2">
                <p class="text-lg">
                  <strong>视频课程卷</strong>：购买年度超级VIP会员，额外赠送[X]张视频课程卷，可用于兑换平台指定的视频课程资源，解锁更丰富的学习内容。
                </p>
              </div>
            </div>
            <div class="mb-4">
              <h3 class="text-xl font-bold mb-2">（三）文档下载与购买优惠</h3>
              <div class="mb-2">
                <p class="text-lg indent-8">
                  使用文档下载卷可免费下载平台文档资源，每次下载扣除对应数量的下载卷。不同类型与篇幅的文档所需扣除的下载卷数量以文档详情页标注为准。
                </p>
              </div>
              <div class="mb-2">
                <p class="text-lg indent-8">
                  若您的下载卷不足，单独购买文档下载卷时，超级VIP会员可享受[X]折专属折扣优惠，满足您更多的文档下载需求。
                </p>
              </div>
            </div>
          </div>

          <br>
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">三、单一专业VIP会员权益</h2>
            <div class="mb-4">
              <h3 class="text-xl font-bold mb-2">（一）单科目学习资源专享</h3>
              <p class="text-lg  indent-8">
                当您开通单一专业VIP会员，即可在所选科目范围内，免费使用该科目下的所有练习题目、模拟考试、历年真题等学习资源。您可针对特定专业方向进行深度学习与强化训练，精准提升专业知识与应试能力。
              </p>
            </div>
            <div class="mb-4">
              <h3 class="text-xl font-bold mb-2">（二）文档下载权益</h3>
              <div class="mb-2">
                <p class="text-lg indent-8">
                  依据您购买单一专业VIP会员的支付金额，将赠送一定数量的文档下载卷，用于免费下载所选科目相关文档。赠送数量与支付金额成正比，具体赠送规则将在购买页面明确展示。
                </p>
              </div>
              <div class="mb-2">
                <p class="text-lg indent-8">
                  与超级VIP会员不同，单一专业VIP会员在单独购买文档下载卷时，不享受折扣优惠，需按平台公示的标准价格购买。
                </p>
              </div>
            </div>
          </div>

          <br>
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">四、会员权益使用规则</h2>
            <ol class="list-decimal pl-8 text-lg ">
              <li>
                会员权益仅限本人账号使用，不得转借、共享或出售。若发现违规行为，平台有权立即终止会员服务，并保留追究相关责任的权利。
              </li>
              <li>
                会员权益自开通之日起生效，有效期以您购买的会员时长为准。到期后，若未及时续费，相关权益将自动失效，已赠送但未使用的文档下载卷、视频课程卷也将同步作废。
              </li>
              <li>
                平台学习资源、文档及视频课程会持续更新与优化，会员可在权益有效期内，免费获取更新后的内容，但新增的非会员付费资源不在免费使用范围内。
              </li>
              <li>
                会员权益所涉及的优惠、赠送活动不可与平台其他优惠活动叠加使用，具体以活动规则说明为准。
              </li>
            </ol>
          </div>

          <br>
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">五、会员续费与升级</h2>
            <div class="mb-4">
              <p class="text-lg indent-8">
                <strong>续费</strong>：会员到期前，您可通过平台会员中心、支付渠道等进行续费操作。续费成功后，会员有效期将在原基础上顺延，继续享受对应会员权益。
              </p>
            </div>
            <div class="mb-4">
              <p class="text-lg indent-8">
                <strong>升级</strong>：若您已开通单一专业VIP会员，后续想升级为超级VIP会员，可在会员中心申请补差价升级。升级成功后，剩余有效期将转换为超级VIP会员时长，同时按升级时的支付金额补赠相应的文档下载卷与视频课程卷（如有）。
              </p>
            </div>
          </div>

          <br>
          <div class="mb-8">
            <h2 class="text-2xl font-bold mb-4">六、其他说明</h2>
            <p class="text-lg indent-8">
              1. 平台有权根据运营需要、市场情况等，对会员权益内容、赠送规则、价格体系等进行调整与优化。调整后的内容将通过站内信、公告等方式提前通知会员。
            </p>
            <p class="text-lg indent-8">
              2. 若您对会员权益有任何疑问或建议，可随时联系平台客服团队，我们将竭诚为您服务。
            </p>
          </div>
          <p class="text-center text-lg">感谢您选择本平台会员服务，期待您在学习之路上收获满满！</p>
          <p class="pt-16 text-center">
            <el-button type="primary" class="px-6 py-3" @click="navigateTo('/')">立即加入会员，畅享专属特权！</el-button>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.protocol-container {
  min-height: calc(100vh - 100px); /* 适配布局，可根据实际调整 */
  }
</style>