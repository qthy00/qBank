<template>
  <el-card v-loading="loading" element-loading-text="加载题目中...">
    <!-- 抬头标题区域 -->
    <div
        class="bg-white shadow-sm sticky top-0 z-30 transition-all duration-300 border-b border-gray-100"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <!-- 标题与返回按钮区域 -->
        <div class="flex justify-between items-center h-16">
          <div>
            <h1 class="text-lg font-semibold text-gray-800">{{ title }}</h1>
            <p class="text-sm text-gray-500">{{ subtitle }}</p>
          </div>

          <div class="flex items-center">
            <button
                class="flex items-center hover:bg-amber-100 rounded-full shadow-sm hover:shadow transition-colors p-1 mr-2"
                @click="handleSetting"
            >
              <Icon name="ep:setting" class="text-amber-600" :size="22"/>
            </button>
            <button
                class="flex items-center bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
                @click="goBack"
            >
              <Icon name="icon-park-outline:return" class="mr-1.5"/>
              返回
            </button>
          </div>
        </div>
        <!-- 进度区 - 与标题区融合 -->
        <div class="pb-4">
          <div class="flex justify-between items-center mb-1.5">
            <span class="text-gray-600 font-medium text-sm">完成进度</span>
            <span class="text-gray-800 font-medium text-sm"
            >第 {{ currentQuestionIndex + 1 }} 题 / 共 {{ total }} 题</span
            >
          </div>

          <el-progress
              :text-inside="true"
              :stroke-width="20"
              :percentage="progressPercentage"
              status="success"
              class="progress-bar-custom"
          />
        </div>
      </div>
    </div>
    <!-- 主内容区 -->
    <main class="container mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <!-- 左侧答题区 (3/4宽度) -->
        <div class="lg:col-span-3">
          <!-- 题目卡片 -->
          <div class="py-5">
            <!-- 题型标识 -->
            <div class="bg-blue-50 border-b border-gray-200 px-6 py-3 relative overflow-hidden">
              <!-- 背景装饰元素 -->
              <div class="absolute -left-8 -top-8 w-16 h-16 bg-blue/5 rounded-full"></div>
              <div class="absolute right-20 bottom-0 w-10 h-10 bg-blue/5 rounded-full"></div>
              <span
                  class="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700 shadow-sm transition-all duration-200 relative z-10"
              >
                <!-- 前缀装饰 -->
                <span class="w-2 h-2 rounded-full bg-primary mr-2"></span>
                {{ typeName }}
              </span>
            </div>

            <!-- 题目内容 -->
            <div class="p-3 bg-gray-50">
              <div class="m-4">
                <template v-if="currentQuestion.type === 4">
                  <div class="text-lg font-semibold text-gray-800 leading-relaxed">
                    请在输入框填写答案
                  </div>
                </template>
                <template v-else>
                  <div
                      class="text-lg font-semibold text-gray-800 leading-relaxed"
                      @click="handleImageClick"
                      v-html="
                      [6, 8].includes(currentQuestion.type)
                        ? currentQuestion.parentQuestion
                        : currentQuestion.content
                    "
                  />
                </template>
              </div>
              <!-- 不同题型的答题区域 -->
              <div class="space-y-4 mb-6 mt-2">
                <!-- 单选/多选题选项 -->
                <div class="flex flex-col gap-2" v-if="[0, 1, 2].includes(currentQuestion.type)">
                  <div
                      v-for="(value, key) in currentQuestion.options"
                      :key="key"
                      @click="handleOptionSelect(key)"
                      class="px-6 py-4 border transition-all duration-300 cursor-pointer rounded-xl"
                      :class="getOptionStyles(key).containerClass"
                  >
                    <div class="flex items-center">
                      <!-- 选项标识 -->
                      <div
                          class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-4 mt-0.5 text-sm font-bold transition-all duration-300"
                          :class="getOptionStyles(key).indicatorClass"
                      >
                        {{ key }}
                      </div>

                      <!-- 选项内容 -->
                      <div class="text-gray-800 leading-relaxed flex-1 pt-0.5" v-html="value"
                           @click="handleImageClick"/>

                      <!-- 正确/错误图标 -->
                      <div
                          class="ml-auto flex-shrink-0 flex items-center justify-center w-8 h-8"
                          v-if="isSubmitted"
                      >
                        <Icon
                            v-if="isOptionCorrect(key)"
                            name="heroicons:check-circle-20-solid"
                            class="text-success transition-all duration-300"
                        />
                        <Icon
                            v-if="isOptionIncorrect(key)"
                            name="heroicons:x-circle-20-solid"
                            class="text-red-500 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 判断题选项 -->
                <div class="grid grid-cols-2 gap-4" v-if="currentQuestion.type === 3">
                  <div
                      v-for="(item, index) in judgeOptions"
                      :key="index"
                      @click="handleOptionSelect(item.value)"
                      class="p-6 rounded-xl border transition-all duration-300 cursor-pointer text-center shadow-md"
                      :class="getOptionStyles(item.value).containerClass"
                  >
                    <div class="flex items-center justify-center">
                      <span class="text-base font-medium text-gray-800">{{ item.label }}</span>
                      <Icon
                          v-if="isSubmitted && isOptionCorrect(item.value)"
                          name="heroicons:check-circle-20-solid"
                          class="text-success ml-3 transition-all duration-300"
                      />
                      <Icon
                          v-if="isSubmitted && isOptionIncorrect(item.value)"
                          name="heroicons:x-circle-20-solid"
                          class="text-red-500 ml-3 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
                <!-- 填空题（支持解析（　　）并自适应宽度） -->
                <div v-if="currentQuestion.type === 4">
                  <div class="space-y-5">
                    <p class="text-slate-700 leading-relaxed">
                      <!-- 拆分文本和填空位置（使用正则表达式匹配（　　）） -->
                      <span
                          v-for="(part, index) in parseFillContent(currentQuestion.content)"
                          :key="index"
                      >
                        <!-- 填空题输入框进一步优化部分 -->
                        <template v-if="part === '（　　）'">
                          <span class="mx-1 inline-block relative">
                            <input
                                v-model="fillAnswers[index]"
                                placeholder="请输入"
                                class="border border-slate-300 rounded-md px-3 py-1.5 text-slate-700 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                                @input="adjustInputWidth(index)"
                                :style="{ width: fillInputWidths[index] }"
                            />
                          </span>
                        </template>
                        <template v-else>{{ part }}</template>
                      </span>
                    </p>
                  </div>
                </div>
                <!-- 案例题 -->
                <div v-if="[5, 6, 7].includes(currentQuestion.type)">
                  <div
                      v-if="currentQuestion.type === 6"
                      class="bg-red-50 p-5 rounded-lg border border-red-100 mb-6 relative overflow-hidden"
                  >
                    <!-- 红色装饰元素 -->
                    <div class="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                    <div class="ml-4">
                      <h3 class="font-medium text-red-800 mb-3 flex items-center">问题</h3>
                      <div
                          class="text-slate-700 leading-relaxed"
                          @click="handleImageClick"
                          v-html="currentQuestion.content"
                      />
                    </div>
                  </div>
                  <!-- 答案输入区域 (标签分两侧显示) -->
                  <div>
                    <div class="flex justify-between items-center mb-2">
                      <label class="block text-sm font-medium text-slate-700"> 输入答案 </label>
                      <span class="text-xs text-slate-500 italic"> 案例题由AI进行解析和判分 </span>
                    </div>
                    <textarea
                        v-model="fillAnswers[0]"
                        :rows="8"
                        placeholder="请在此输入您的答案..."
                        @input="handleCaseInput"
                        class="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-y"
                    ></textarea>
                  </div>
                </div>
                <!-- 复合题（一题多问，使用数字序号） -->
                <div v-if="currentQuestion.type === 8">
                  <el-divider/>
                  <div class="space-y-8">
                    <!-- 子问题列表 -->
                    <div class="space-y-8">
                      <div
                          v-for="(subQuestion, subIndex) in currentQuestion.questionList"
                          :key="subIndex"
                          class="border-l-2 border-indigo-200 pl-4 py-1"
                      >
                        <div class="flex items-start justify-between mb-3">
                          <div class="flex items-start">
                            <span class="font-bold text-slate-800" v-html="subQuestion.content"
                                  @click="handleImageClick"/>
                          </div>
                          <div
                              :class="getSubQuestionTypeClass(subQuestion.parentSonType)"
                              class="px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 w-[60px]"
                          >
                            {{ typeNames[subQuestion.parentSonType] }}
                          </div>
                        </div>

                        <!-- 子问题选项（根据子问题类型显示） -->
                        <div v-if="[0, 1, 2].includes(subQuestion.parentSonType)">
                          <div class="space-y-2">
                            <div
                                v-for="(value, key) in subQuestion.options"
                                :key="key"
                                @click="handleOptionSelect(key, subQuestion.id)"
                                class="px-6 py-4 border transition-all duration-300 cursor-pointer rounded-xl"
                                :class="{
                                // 选中状态 - 未提交
                                'border-primary bg-blue-100 shadow-md':
                                  isOptionSelected(key, subQuestion.id) && !isSubmitted,
                                // 正确状态 - 已提交
                                'border-green-500 bg-green-50 shadow-md':
                                  isSubmitted && checkOptionStatus(key, subQuestion.id),
                                // 错误状态 - 已提交
                                'border-red-500 bg-red-100 shadow-md ring-1 ring-red-100':
                                  isSubmitted && checkOptionStatus(key, subQuestion.id) === false,
                                // 未选中状态 - 未提交
                                'border-gray-200 hover:border-blue-300 hover:bg-blue-200':
                                  !isOptionSelected(key, subQuestion.id) && !isSubmitted,
                              }"
                            >
                              <div class="flex items-center">
                                <!-- 选项标识 -->
                                <div
                                    class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mr-4 mt-0.5 text-sm font-bold transition-all duration-300"
                                    :class="{
                                    // 选中状态标识
                                    'bg-primary text-white':
                                      isOptionSelected(key, subQuestion.id) && !isSubmitted,
                                    // 正确状态标识
                                    'bg-success text-white':
                                      isSubmitted && checkOptionStatus(key, subQuestion.id),
                                    // 错误状态标识
                                    'bg-red-500 text-white':
                                      isSubmitted &&
                                      checkOptionStatus(key, subQuestion.id) === false,
                                    // 未选中状态标识
                                    'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700':
                                      !isOptionSelected(key, subQuestion.id) && !isSubmitted,
                                  }"
                                >
                                  {{ key }}
                                </div>

                                <!-- 选项内容 -->
                                <div class="text-gray-800 leading-relaxed flex-1 pt-0.5" v-html="value"
                                     @click="handleImageClick"/>

                                <!-- 正确/错误图标 -->
                                <div
                                    class="ml-auto flex-shrink-0 flex items-center justify-center w-8 h-8"
                                    v-if="isSubmitted"
                                >
                                  <Icon
                                      v-if="isOptionCorrect(key, subQuestion.id)"
                                      name="heroicons:check-circle-20-solid"
                                      class="text-success transition-all duration-300"
                                  />
                                  <Icon
                                      v-if="isOptionIncorrect(key, subQuestion.id)"
                                      name="heroicons:x-circle-20-solid"
                                      class="text-red-500 transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4" v-if="subQuestion.parentSonType === 3">
                          <div
                              v-for="(item, index) in judgeOptions"
                              :key="index"
                              @click="handleOptionSelect(item.value, subQuestion.id)"
                              class="p-6 rounded-xl border transition-all duration-300 cursor-pointer text-center shadow-md"
                              :class="{
                              // 选中状态 - 未提交
                              'border-primary bg-blue-100':
                                isOptionSelected(item.value, subQuestion.id) && !isSubmitted,
                              // 正确状态 - 已提交
                              'border-green-500 bg-green-50':
                                isSubmitted && checkOptionStatus(item.value, subQuestion.id),
                              // 错误状态 - 已提交
                              'border-red-500 bg-red-100 ring-1 ring-red-100':
                                isSubmitted &&
                                checkOptionStatus(item.value, subQuestion.id) === false,
                              // 未选中状态 - 未提交
                              'border-gray-200 hover:border-blue-300 hover:bg-blue-200':
                                !isOptionSelected(item.value, subQuestion.id) && !isSubmitted,
                            }"
                          >
                            <div class="flex items-center justify-center">
                              <span class="text-base font-medium text-gray-800">{{
                                  item.label
                                }}</span>
                              <Icon
                                  v-if="isSubmitted && isOptionCorrect(item.value, subQuestion.id)"
                                  name="heroicons:check-circle-20-solid"
                                  class="text-success ml-3 transition-all duration-300"
                              />
                              <Icon
                                  v-if="isSubmitted && isOptionIncorrect(item.value, subQuestion.id)"
                                  name="heroicons:x-circle-20-solid"
                                  class="text-red-500 ml-3 transition-all duration-300"
                              />
                            </div>
                          </div>
                        </div>
                        <div v-if="[5, 7].includes(subQuestion.parentSonType)">
                          <div>
                            <div class="flex justify-between items-center mb-2">
                              <label class="block text-sm font-medium text-slate-700"> </label>
                              <span class="text-xs text-slate-500 italic">
                                案例题由AI进行解析和判分
                              </span>
                            </div>
                            <textarea
                                v-model="fillAnswers[subIndex]"
                                :rows="8"
                                placeholder="请在此输入您的答案..."
                                @input="handleCaseInput"
                                class="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 resize-y"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div
                  class="flex flex-wrap justify-between items-center pt-4 border-t border-gray-100 gap-3"
              >
                <el-button
                    type="info"
                    plain
                    @click="prevQuestion"
                    :disabled="currentQuestionIndex === 0"
                >
                  <Icon name="ep:back" class="mr-2"/>
                  上一题
                </el-button>

                <el-button type="warning" plain @click="handleSkip">
                  <Icon name="ep:right" class="mr-2"/>
                  跳过
                </el-button>

                <div class="flex gap-3">
                  <el-button
                      type="primary"
                      plain
                      v-if="!isSubmitted"
                      @click="submitAnswer"
                      :disabled="currentAnswer === null"
                  >
                    <Icon name="ep:finished" class="mr-2"/>
                    提交答案
                  </el-button>

                  <el-button
                      type="success"
                      plain
                      v-if="isSubmitted && currentQuestionIndex + 1 < total"
                      @click="nextQuestion"
                      class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center bg-green-600 hover:bg-green-700 text-white"
                  >
                    下一题
                    <Icon name="ep:right" class="ml-2"/>
                  </el-button>
                  <el-button
                      type="success"
                      plain
                      v-if="isSubmitted && (answeredQuestions.length === total || currentQuestionIndex + 1 === total)"
                      @click="handleFinish"
                      class="px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center bg-green-600 hover:bg-green-700 text-white"
                  >
                    完成练习
                    <Icon name="ep:right" class="ml-2"/>
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 解析区域 -->
          <div v-if="showExplanation">
            <!-- 题型标识 - UnoCSS样式 + 装饰元素 -->
            <div class="bg-blue-50 border-b border-gray-200 px-6 py-3 relative overflow-hidden">
              <!-- 背景装饰元素 -->
              <div class="absolute -left-8 -top-8 w-16 h-16 bg-blue/5 rounded-full"></div>
              <div class="absolute right-20 bottom-0 w-10 h-10 bg-blue/5 rounded-full"></div>

              <div class="flex items-center">
                <div
                    class="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3"
                >
                  <Icon name="heroicons:book-open-20-solid" class="w-5 h-5"/>
                </div>
                题目解析
              </div>
            </div>

            <template v-if="currentQuestion.type === 8">
              <div class="p-5 bg-gray-50 space-y-4" v-for="sub in currentQuestion.questionList" :key="sub.id">
                <div v-html="sub.content" @click="handleImageClick"/>
                <!-- 正确答案 -->
                <div class="bg-green-100 rounded-lg px-5 py-3 border border border-green-100">
                  <div class="flex items-center">
                    <!-- 标题部分 -->
                    <div class="flex-shrink-0 flex items-center mr-3">
                      <div
                          class="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-xs mr-2"
                      >
                        <Icon name="heroicons:check-20-solid" class="w-3.5 h-3.5"/>
                      </div>
                      <h4 class="text-sm font-medium text-gray-800">正确答案：</h4>
                    </div>

                    <!-- 内容部分 -->
                    <div class="flex-1">
                      <!-- 判断题答案 -->
                      <template v-if="sub.parentSonType === 3">
                      <span
                          class="bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm border border-green-200"
                      >
                        {{ sub.answer == '1' ? '正确' : '错误' }}
                      </span>
                      </template>
                      <template v-else>
                      <span
                          class="bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm border border-green-200 hover:border-green-300 transition-colors"
                      >
                        {{ sub.answer }}
                      </span>
                      </template>
                    </div>
                  </div>
                </div>
                <!-- 考点 -->
                <div class="bg-blue-50 rounded-lg px-5 py-3 border border-blue-100">
                  <div class="flex items-center">
                    <!-- 标题部分 -->
                    <div class="flex-shrink-0 flex items-center mr-1">
                      <div
                          class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2"
                      >
                        <Icon name="icon-park-outline:brain" class="w-3.5 h-3.5"/>
                      </div>
                      <h4 class="text-sm font-medium text-gray-800">考点：</h4>
                    </div>

                    <!-- 内容部分 -->
                    <div class="flex-1 text-gray-700 text-sm leading-relaxed">
                      {{ sub.point || '未指定考点' }}
                    </div>
                  </div>
                </div>
                <!-- 解析内容 -->
                <div class="bg-gray-100 rounded-lg p-4 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-800 mb-3 flex items-center">解析说明：</h4>
                  <div
                      class="pl-2 text-gray-800 text-sm leading-relaxed"
                      @click="handleImageClick"
                      v-html="sub.analysis || '暂无解析'"
                  />
                </div>
              </div>
            </template>
            <template v-else>
              <div class="p-5 bg-gray-50 space-y-4">
                <!-- 正确答案 -->
                <div class="bg-green-100 rounded-lg px-5 py-3 border border border-green-100">
                  <div class="flex items-center">
                    <!-- 标题部分 -->
                    <div class="flex-shrink-0 flex items-center mr-3">
                      <div
                          class="w-5 h-5 rounded-full bg-success text-white flex items-center justify-center text-xs mr-2"
                      >
                        <Icon name="heroicons:check-20-solid" class="w-3.5 h-3.5"/>
                      </div>
                      <h4 class="text-sm font-medium text-gray-800">正确答案：</h4>
                    </div>

                    <!-- 内容部分 -->
                    <div class="flex-1">
                      <!-- 判断题答案 -->
                      <template v-if="currentQuestion.type === 3">
                      <span
                          class="bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm border border-green-200"
                      >
                        {{ currentQuestion.answer == '1' ? '正确' : '错误' }}
                      </span>
                      </template>
                      <template v-else>
                      <span
                          class="text-gray-800 px-3 py-1.5 text-sm transition-colors leading-relaxed"
                      >
                        {{ currentQuestion.answer }}
                      </span>
                      </template>
                    </div>
                  </div>
                </div>

                <!-- 考点 -->
                <div class="bg-blue-50 rounded-lg px-5 py-3 border border-blue-100">
                  <div class="flex items-center">
                    <!-- 标题部分 -->
                    <div class="flex-shrink-0 flex items-center mr-1">
                      <div
                          class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2"
                      >
                        <Icon name="icon-park-outline:brain" class="w-3.5 h-3.5"/>
                      </div>
                      <h4 class="text-sm font-medium text-gray-800">考点：</h4>
                    </div>

                    <!-- 内容部分 -->
                    <div class="flex-1 text-gray-700 text-sm leading-relaxed">
                      {{ currentQuestion.point || '未指定考点' }}
                    </div>
                  </div>
                </div>

                <!-- 解析内容 -->
                <div class="bg-gray-100 rounded-lg p-4 border border-gray-100">
                  <h4 class="text-sm font-medium text-gray-800 mb-3 flex items-center">解析说明：</h4>
                  <div
                      class="pl-2 text-gray-800 text-sm leading-relaxed"
                      @click="handleImageClick"
                      v-html="currentQuestion.analysis || '暂无解析'"
                  />
                </div>
              </div>
            </template>


          </div>
        </div>
        <!-- 右侧答题卡 -->
        <AnswerSheet
            :questions="questions"
            :current-index="currentQuestionIndex"
            :total-count="total"
            :answered="answeredQuestions"
            :answerCache="answerCache"
            mode="practice"
            @redirect="handleToQuestion"
        />
      </div>
    </main>
  </el-card>

  <QuestionSetting ref="settingRef"/>
</template>

<script setup lang="ts">
import QuestionSetting from './components/QuestionSetting.vue'
import AnswerSheet from './components/AnswerSheet.vue'
import {questionApi, type QuestionReqVO, typeNames} from '@/api/qbank'
import {judgeOptions, getSubQuestionTypeClass, goBackIndex} from './func.ts'
import type {AnswerCache, AnswerDetail, QuestionVO} from '~/types/qBank'
import {createImageViewer} from '@/components/ImageViewer'
import {usePayWithPopup} from '~/composables/usePayRedirect.ts'
import {isArrayValueEqual} from '@/utils/is.ts'
import {stripHtmlTags} from '@/utils'


// 路由相关
const {params, query} = useRoute()

const appStore = useAppStore()
const {isMobile} = storeToRefs(appStore)

const packageStore = usePackageStore()
const {qPackage} = storeToRefs(packageStore)

const questionStore = useQBankStore()
const {
  subjectId,
  chapterId,
  sectionId,
  userSetting,
  random,
  showAnswerSetting,
  title,
  subtitle
} = storeToRefs(questionStore)


const questionId = query.qid as unknown as number
const isRestart = query.restart as unknown as string
const mode = params.examMode as string

const showMobileAnswerCard = ref(false) // 控制移动端答题卡显示

const loading = ref(false)

const total = ref(0)
const questions = ref<QuestionVO[]>([])
const currentQuestionIndex = ref(0)
const answeredQuestions = ref<number[]>([]) // 已答题目的索引数组
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {})
const answerCache = ref<AnswerCache>({}) // 缓存用户答案：{ questionId: { answer, spendTime, hesitationCount, ... } }
// 当前题目的临时状态
const currentAnswer = ref<string[]>([])
const compositeAnswer = ref<{ id: number; answer: string[] }[]>([]) //复合题的答案
const spendTime = ref<number>(0)
const hesitationCount = ref(0)
const answerTimer = ref()
const lastAnswerState = ref()

// 初始化答案缓存（如果之前答过这批题，恢复数据）
const initAnswerCache = () => {
  questions.value.forEach((question) => {
    answerCache.value[question.id] = {
      userAnswer: {},
      spendTime: 0,
      hesitationCount: 0,
      isSubmitted: false,
      isCorrect: undefined,
    }
  })
  // 恢复当前题目的缓存数据
  restoreCurrentQuestionCache()
}

// 切换题目时恢复缓存
const restoreCurrentQuestionCache = () => {
  const question = currentQuestion.value
  if (!question) return

  compositeAnswer.value = []
  currentAnswer.value = []
  lastAnswerState.value = undefined

  const cache = answerCache.value[question.id] as AnswerDetail
  // 恢复答案
  const userAnswer = cache.userAnswer || []

  if (Object.keys(userAnswer).length > 0) {
    if (question.type === 8) {
      for (const key in userAnswer) {
        // 将字符串键转换为数字（因为对象键本质是字符串）
        const numericKey = Number(key)
        const value = userAnswer[numericKey]
        compositeAnswer.value.push({
          id: numericKey,
          answer: value.split(','),
        })
      }
    } else {
      const value = Object.values(userAnswer)[0]
      currentAnswer.value = value ? value.split(',') : []
    }
  }

  // 恢复计时（未提交的题目可继续计时）
  spendTime.value = cache.isSubmitted ? (cache.spendTime || 0) : 0
  hesitationCount.value = cache.hesitationCount || 0
  const isChoiceQuestion = [0, 1, 2, 3].includes(question.type)
  if (isChoiceQuestion) {
    lastAnswerState.value = JSON.stringify(currentAnswer.value)
  }

  // 已提交的题目不再计时
  cache.isSubmitted ? stopTimer() : startTimer()
}

// 计时器控制
const startTimer = () => {
  answerTimer.value = setInterval(() => {
    spendTime.value++
  }, 1000)
}

const stopTimer = () => {
  clearInterval(answerTimer.value)
}

// 进度百分比
const progressPercentage = computed(() => {
  return Math.round((answeredQuestions.value.length / total.value) * 100) || 0
})

const typeName = computed(() => {
  if (!currentQuestion.value) return ''
  return typeNames[currentQuestion.value.type] || '单选题'
})

// 是否已提交当前题目的答案
const isSubmitted = computed(() => answerCache.value[currentQuestion.value.id]?.isSubmitted)
const showExplanation = computed(() => {
  const cache = answerCache.value[currentQuestion.value.id]
  switch (showAnswerSetting.value) {
    case 0:
      return true
    case 1:
      return !!(cache && cache.isSubmitted && !cache.isCorrect)
    case 2:
      return false
    case 3:
      return !!(cache && cache.isSubmitted)
  }
})

// 解析填空题内容，分离文本和填空位置
const parseFillContent = (content: string) => {
  content = stripHtmlTags(content)
  if (!content) return []
  // 正则表达式匹配（　　）并拆分内容
  return content.split(/（　　）/g).flatMap((part, i, arr) => {
    // 除了最后一个元素外，每个拆分后的部分后面都添加一个（　　）标记
    if (i < arr.length - 1) {
      return [part, '（　　）']
    }
    return [part]
  })
}
const fillAnswers = ref<string[]>([]) // 填空题当前答案
const fillInputWidths = ref<string[]>([])
// 调整输入框宽度的方法 - 优化版逻辑
const adjustInputWidth = (index: number) => {
  const userInput = fillAnswers.value.filter((item) => item !== null)
  currentAnswer.value = [userInput.join('###')]

  const text: string = fillAnswers.value[index] || ''
  const charWidth = 8 // 每个字符宽度
  const baseChars = 10 // 初始基础字符数
  const minExpandChars = 6 // 开始扩展的最小字符数
  const extraChars = 4 // 额外留白字符数
  const padding = 30 // 左右内边距总和

  // 计算宽度的核心逻辑
  let totalChars: number
  if (text.length >= minExpandChars) {
    // 当输入长度≥6时，宽度 = 实际长度 + 额外留白
    totalChars = text.length + extraChars
  } else {
    // 否则保持初始固定宽度（10个字符）
    totalChars = baseChars
  }
  // 计算最终宽度（字符数×单个宽度 + 内边距）
  fillInputWidths.value[index] = totalChars * charWidth + padding + 'px'
}
// 初始化输入框宽度（固定为10个字符宽度）
const initInputWidths = () => {
  if (currentQuestion.value.type !== 4 || !currentQuestion.value.content) return
  const parts = parseFillContent(currentQuestion.value.content)
  const blankCount = parts.length
  const charWidth = 8
  const baseChars = 10
  const padding = 30
  const initialWidth = baseChars * charWidth + padding + 'px'

  // 为每个输入框设置初始宽度
  for (let i = 0; i < blankCount; i++) {
    // 如果已有内容且长度≥6，按内容计算宽度
    if (fillAnswers.value[i] && fillAnswers.value[i].length >= 6) {
      adjustInputWidth(i)
    } else {
      // 否则使用初始固定宽度
      fillInputWidths.value[i] = initialWidth
    }
  }
}

watch(currentQuestionIndex, () => {
  stopTimer()
  restoreCurrentQuestionCache()
  initInputWidths()
})

const settingRef = ref()
const handleSetting = () => {
  settingRef.value!.open()
}

let startTime = ref(0)

// 按考点分组的统计数据：包含考点名称、题目数量、正确率
const pointStatistics = computed(() => {
  // 存储分组数据：key为考点ID，value为统计信息
  const pointMap: Record<
      string | number,
      {
        name: string // 考点名称
        questionCount: number // 组内题目总数
        correctCount: number // 做对的题目数
      }
  > = {}

  questions.value.forEach((question: any, index: number) => {
    // 获取当前题目的考点信息（假设point是包含id和name的对象）
    let point = question.point
    if (!point || point.trim() === '') {
      point = '未分类'
    }

    // 如果该考点分组不存在，初始化统计信息
    if (!pointMap[point]) {
      pointMap[point] = {
        name: point,
        questionCount: 0,
        correctCount: 0,
      }
    }

    // 更新题目总数
    pointMap[point].questionCount++

    // 计算正确题数（过滤未提交的情况）
    const isCorrect = answerCache.value[question.id].isCorrect
    if (isCorrect) {
      pointMap[point].correctCount++
    }
  })
  return Object.values(pointMap).map((stat) => ({
    ...stat,
    // 计算正确率（保留两位小数，未答题时为0）
    correctRate:
        stat.questionCount > 0 ? Math.round((stat.correctCount / stat.questionCount) * 100) : 0,
  }))
})

watch(pointStatistics, (newVal) => {
  questionStore.pointStatistics = newVal
})

// 选项是否被选中
const isOptionSelected = (key: string, questionId?: number) => {
  if ([0, 1, 2, 3].includes(currentQuestion.value.type)) {
    return currentAnswer.value && currentAnswer.value.includes(key)
  }
  if (questionId != undefined) {
    return (
        compositeAnswer.value &&
        compositeAnswer.value.find((item) => item.id === questionId)?.answer.includes(key)
    )
  }
  return false
}

// 选项是否正确
const isOptionCorrect = (key: string, questionId?: number) => {
  if ([0, 1, 2, 3].includes(currentQuestion.value.type)) {
    return currentQuestion.value.answer?.includes(key) && currentAnswer.value?.includes(key)
  }
  if (questionId != undefined) {
    return (
        currentQuestion.value.questionList.find((item) => item.id === questionId)
            ?.answer?.includes(key) &&
        compositeAnswer.value.find((item) => item.id === questionId)?.answer.includes(key)
    )
  }
  return false
}

// 选项是否错误
const isOptionIncorrect = (key: string, questionId?: number) => {
  if (!isSubmitted.value) return false

  if ([0, 1, 2, 3].includes(currentQuestion.value.type)) {
    return !currentQuestion.value.answer.includes(key) && currentAnswer.value?.includes(key)
  }
  if (questionId != undefined) {
    return (
        !currentQuestion.value.questionList
            .find((item) => item.id === questionId)
            ?.answer?.includes(key) &&
        compositeAnswer.value.find((item) => item.id === questionId)?.answer.includes(key)
    )
  }

  return false
}

const checkOptionStatus = (key: string, questionId?: number) => {
  if (!isSubmitted.value) return undefined
  // 获取对应的答案数据
  const targetAnswer =
      questionId !== undefined
          ? currentQuestion.value.questionList.find((item) => item.id === questionId)?.answer
          : currentQuestion.value.answer

  // 答案不存在时返回未判断
  if (!targetAnswer) return undefined
  const userAnswer =
      questionId !== undefined
          ? compositeAnswer.value.find((item) => item.id === questionId)?.answer
          : currentAnswer.value[0]
  const isCorrect = targetAnswer.includes(key)
  const userSelected = userAnswer?.includes(key) ?? false
  // 已选择且不正确 → 错误
  if (userSelected && !isCorrect) {
    return false
  }
  // 正确选项（无论是否选择）
  return isCorrect ? true : undefined
}
// 处理选项选择
const handleOptionSelect = (key: string, questionId?: number) => {
  if (isSubmitted.value) return

  if (!currentAnswer.value) {
    currentAnswer.value = []
  }

  let targetQuestion: any
  let targetAnswer: any[]

  if (questionId !== undefined) {
    targetQuestion = currentQuestion.value.questionList.find((item: any) => item.id === questionId)
    const compositeItem = compositeAnswer.value.find((item: any) => item.id === questionId)
    targetAnswer = compositeItem?.answer || []
  } else {
    targetQuestion = currentQuestion.value
    targetAnswer = currentAnswer.value
  }

  // 判断是否为单选题/判断题
  const questionType =
      questionId !== undefined ? targetQuestion?.parentSonType : targetQuestion.type

  const isSingleChoice = [0, 3].includes(questionType ?? -1)

  // 查找当前key是否已存在
  const keyIndex = targetAnswer.indexOf(key)
  const isKeyExists = keyIndex !== -1

  // 计算新答案（逻辑简化）
  let newAnswer: string[]
  if (isKeyExists) {
    // 移除已存在的key
    newAnswer = [...targetAnswer.slice(0, keyIndex), ...targetAnswer.slice(keyIndex + 1)]
  } else {
    // 添加新key，单选题直接替换
    newAnswer = isSingleChoice ? [key] : [...targetAnswer, key]
  }
  // 更新答案（避免重复查找）
  if (questionId !== undefined) {
    const compositeItem = compositeAnswer.value.find((item: any) => item.id === questionId)
    if (compositeItem) {
      compositeItem.answer = newAnswer
    } else {
      compositeAnswer.value.push({
        id: questionId,
        answer: newAnswer,
      })
    }
  } else {
    currentAnswer.value = newAnswer
  }
  // 记录犹豫次数（与上次状态不同时）
  const currentState = JSON.stringify(newAnswer)
  if (lastAnswerState.value && lastAnswerState.value !== currentState) {
    hesitationCount.value++
  }
  lastAnswerState.value = currentState
}

const handleCaseInput = () => {
  if (isSubmitted.value) return
  currentAnswer.value = fillAnswers.value
}

const {redirectToPay} = usePayWithPopup()
// 提交答案
const submitAnswer = async () => {
  if (currentAnswer.value === null) return
  stopTimer()
  // 判断答案是否正确
  let isCorrect = false
  let userAnswer: Record<number, string> = {}
  let {type, questionList, contentId, isRepeat, id, typeName} = currentQuestion.value

  if (type === 8) {
    questionList.forEach((sub) => {
      const subAnswer = compositeAnswer.value.find((i) => i.id === sub.id)?.answer
      userAnswer[sub.id] = subAnswer ? subAnswer.join(',') : ''
    })
  } else {
    userAnswer[id] = currentAnswer.value.join(',')
  }
  // 整理答案数据
  const answerData = {
    contentId,
    userAnswer,
    typeName,
    spendTime: spendTime.value,
    hesitationCount: hesitationCount.value,
    isRepeat: isRepeat || 0,
    answerTime: new Date().getTime(),
    isMistake: mode == 'mistake',
    toolId: qPackage.value.id,
    categoryId: qPackage.value.relationCategoryId
  }

  try {
    // 提交到后端
    const data = await questionApi.submitCurrentQuestion(answerData)
    const current = data.find((item: any) => item.id === id)
    console.log('current', current )
    currentQuestion.value.answer = current.answer
    if (current.type === 3) {
      return current.answer == '1' ? '正确' : '错误'
    } else if (current.type === 4) {
      return current.answer.split('###').join('；')
    }

    currentQuestion.value.analysis = current.analysis
    currentQuestion.value.point = current.point


    if (type === 8) {
      questionList.forEach((sub: any) => {
        const subItem = data.find((i: any) => i.id === sub.id)
        if (subItem) {
          sub.answer = subItem.answer
          if (subItem.parentSonType === 3) {
            return sub.answer == '1' ? '正确' : '错误'
          } else if (current.parentSonType === 4) {
            return sub.answer.split('###').join('；')
          }
          sub.analysis = subItem.analysis
          sub.point = subItem.point
        }
      })
    }
  } catch (e: string | any) {
    // 提交失败时回滚缓存状态
    answerCache.value[id].isSubmitted = false
    let errorMsg = '';
    if (e instanceof Error) {
      errorMsg = e.message; // 获取错误信息（核心："试用次数已用完，请购买完整版。"）
    } else {
      // 处理非Error类型的异常（如字符串、数字等）
      errorMsg = typeof e === 'string' ? e : String(e);
    }
    if (errorMsg.includes('试用次数已用完')) {
      setTimeout(() => {
        redirectToPay(qPackage.value, `/t/${qPackage.value.series}`)
      }, 500)
    }
    return
  }

  const answer = currentQuestion.value.answer
  questionList = currentQuestion.value.questionList
  switch (type) {
    case 1:
    case 2:
      const correctAnswers = answer?.split(',')
      isCorrect = isArrayValueEqual(correctAnswers, currentAnswer.value)
      break
    case 0:
    case 3:
    case 4:
      isCorrect = currentAnswer.value[0] === answer
      break
    case 8:
      isCorrect = true
      // 需要所有子问题都正确
      for (const sub of questionList) {
        const subAnswer = compositeAnswer.value.find((i) => i.id === sub.id)?.answer
        if (!subAnswer) {
          isCorrect = false
          break
        }

        let subIsCorrect = false
        if ([1, 2].includes(sub.parentSonType)) {
          const correctSubAnswers = sub.answer.split(',')
          subIsCorrect = isArrayValueEqual(correctSubAnswers, subAnswer)
        } else if ([0, 3].includes(sub.parentSonType)) {
          subIsCorrect = subAnswer[0] === sub.answer
        }
        // 只要有一个子问题错误，整体就错误
        if (!subIsCorrect) {
          isCorrect = false
          break
        }
      }
      break
    default:
      break
  }

  // 先更新本地缓存（优化用户体验，避免等待后端响应）
  answerCache.value[id] = {
    ...answerData,
    isSubmitted: true,
    isCorrect,
  }

  answeredQuestions.value.push(id)
  if (showAnswerSetting.value === 2 || (showAnswerSetting.value === 1 && isCorrect)) {
    nextQuestion()
  }
}

// const submitBatchStats = async () => {
//   const correctCount = Object.values(answerCache.value).filter((c) => c.isCorrect).length
//   const submittedCount = answeredQuestions.value.length
//   const totalTime = Object.values(answerCache.value).reduce((sum, c) => sum + c.spendTime, 0) || 0
//   const correctRate = Math.round((correctCount / submittedCount) * 100)
//   questionStore.saveTimeRate(totalTime, correctRate)
//   questionStore.totalCount = total.value
//   const stats = {
//     totalQuestions: total.value,
//     submittedCount,
//     correctCount,
//     totalTime,
//     finishTime: new Date().getTime(),
//   }
//   try {
//     await questionApi.submitBatchStats(stats)
//   } catch (error) {
//     console.error('提交批量统计失败', error)
//   }
// }

const handleToQuestion = (index: number) => {
  fillAnswers.value = []
  currentQuestionIndex.value = index
  if (isMobile.value) {
    showMobileAnswerCard.value = false
  }
}

// 上一道题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}
// 下一道题
const nextQuestion = () => {
  fillAnswers.value = []
  if (currentQuestionIndex.value + 1 < total.value) {
    currentQuestionIndex.value++
  } else {
    handleFinish()
  }
}
// 跳过题目（不提交答案，但记录跳过状态）
const handleSkip = () => {
  const question = currentQuestion.value
  if (question) {
    // 记录跳过状态
    answerCache.value[question.id] = {
      ...answerCache.value[question.id],
      isSkipped: true,
      spendTime: spendTime.value, // 记录已用时
    }
  }
  stopTimer()
  if (currentQuestionIndex.value + 1 < total.value) {
    currentQuestionIndex.value++
  } else {
    handleFinish()
  }
}

const handleFinish = () => {
  try {
    const endTime = new Date().getTime()
    // 计算总用时（毫秒）
    const duration = (endTime - startTime.value) / (1000 * 60)
    const rate = calculateCorrectRate()
    questionStore.saveTimeRate(Math.ceil(duration), rate)
    navigateTo({name: 'ExerciseResult', params: {toolId: qPackage.value.id}});
  } catch (err) {
    console.error('提交或跳转失败:', err); // 捕获错误
  }
}

const calculateCorrectRate = () => {
  let correctCount = 0
  questions.value.forEach((question: any) => {
    // 计算正确题数（过滤未提交的情况）
    const isCorrect = answerCache.value[question.id].isCorrect
    if (isCorrect) {
      correctCount++
    }
  })
  return Math.round((correctCount / total.value) * 100)
}

// 查看图片
const imagePreview = (imgUrl: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [imgUrl],
  })
}
// 监听图片点击（事件委托）
const handleImageClick = (e) => {
  // 判断点击的目标是否是图片
  if (e.target.tagName === 'IMG') {
    e.stopPropagation(); // 阻止事件冒泡（避免触发容器其他点击逻辑）
    imagePreview(e.target.src)
  }
}


// 定义状态类型，约束可能的取值
type OptionStatus = 'selected' | 'correct' | 'incorrect' | 'default'

// 定义样式映射类型
interface StyleMaps {
  container: Record<OptionStatus, string>
  indicator: Record<OptionStatus, string>
}

// 集中管理样式映射，便于统一修改
const styleMaps: StyleMaps = {
  container: {
    selected: 'border-primary bg-blue-100 shadow-md',
    correct: 'border-green-500 bg-green-50 shadow-md',
    incorrect: 'border-red-500 bg-red-100 shadow-md ring-1 ring-red-100',
    default: 'border-gray-200 hover:border-blue-300 hover:bg-blue-200',
  },
  indicator: {
    selected: 'bg-primary text-white',
    correct: 'bg-success text-white',
    incorrect: 'bg-red-500 text-white',
    default: 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700',
  },
}

// 计算选项状态（复用原逻辑，增加类型约束）
const getOptionStatus = (key: string, questionId?: number): OptionStatus => {
  if (isSubmitted.value) {
    const checkResult = checkOptionStatus(key, questionId)
    if (checkResult) return 'correct'
    if (checkResult === false) return 'incorrect'
    return 'default'
  }
  return isOptionSelected(key) ? 'selected' : 'default'
}

// 一次调用同时获取容器和标识样式，减少状态计算次数
const getOptionStyles = (key: string, questionId?: number) => {
  const status = getOptionStatus(key, questionId)
  return {
    containerClass: styleMaps.container[status],
    indicatorClass: styleMaps.indicator[status],
  }
}

const goBack = async () => {
  if (mode == 'mistake') {
    await navigateTo({
      name: 'ExamMistakes',
      params: {toolId: qPackage.value.id}
    })
  } else {
    await goBackIndex(qPackage.value.id)
  }
}

const loadQuestion = async () => {
  if (!questionId) return
  loading.value = true
  try {
    const data = await questionApi.getQuestion(questionId)
    total.value = 1
    questions.value = [data]
    initAnswerCache()
  } finally {
    loading.value = false
  }
}

const loadQuestionList = async () => {

  const params: QuestionReqVO = {
    type: userSetting.value.type,
    pageSize: userSetting.value.amount,
    random: random.value,
  }
  if (mode == 'mistake') {
    params.categoryId = qPackage.value.relationCategoryId
    params.status = 13
    params.mastery = false
  } else {
    if (!subjectId.value && !chapterId.value && !sectionId.value) return
    params.subjectId = subjectId.value
    params.chapterId = chapterId.value
    params.sectionId = sectionId.value
    params.status = userSetting.value.status
  }
  if (isRestart) {
    params.status = 10
  }
  loading.value = true
  try {
    const data = await questionApi.getQuestionList(params)
    total.value = data.total
    questions.value = data.list
    initAnswerCache()
  } catch (e) {
  } finally {
    loading.value = false
  }
}

useHead({
  title: `${mode == 'mistake' ? '错题' : '章节'}练习-${qPackage.value.title}`,
})


onMounted(async () => {
  if (questionId) {
    await loadQuestion()
  } else {
    await loadQuestionList()
  }
  initInputWidths()
  // 记录开始时间
  startTime.value = new Date().getTime()
  questionStore.totalCount = total.value
})

onUnmounted(() => {
  stopTimer()
})
</script>
