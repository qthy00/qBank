<script setup lang="ts">
import { useLevelStore } from '~/stores/level'
import { useUserStore } from '~/stores/user'

/**
 * 会员等级页面
 */
definePageMeta({
  layout: 'member',
  middleware: ['auth']
})

useHead({
  title: '会员等级 - 学次元在线题库'
})

const levelStore = useLevelStore()
const userStore = useUserStore()

/* 当前经验值（从用户信息中获取） */
const currentExperience = computed(() => userStore.user?.experience || 0)

/* 当前等级 */
const currentLevel = computed(() => userStore.user?.level || null)

/* 等级进度 */
const levelProgress = computed(() => {
  return levelStore.calculateProgress(currentExperience.value, currentLevel.value)
})

/* 经验记录分页 */
const currentPage = ref(1)
const pageSize = ref(10)

/* 初始化 */
onMounted(async () => {
  await levelStore.fetchLevelList()
  await levelStore.fetchExperienceRecords({
    pageNo: currentPage.value,
    pageSize: pageSize.value
  })
})

/* 加载更多 */
const loadMore = async () => {
  currentPage.value++
  await levelStore.loadMoreExperienceRecords({
    pageNo: currentPage.value,
    pageSize: pageSize.value
  })
}

/* 获取等级颜色 */
const getLevelColor = (level: number): string => {
  const colors: Record<number, string> = {
    1: '#909399',  /* 普通会员 - 灰色 */
    2: '#cd7f32',  /* 铜牌 - 铜色 */
    3: '#c0c0c0',  /* 银牌 - 银色 */
    4: '#ffd700',  /* 金牌 - 金色 */
    5: '#e3e3e3'   /* 钻石 - 钻石色 */
  }
  return colors[level] || '#909399'
}

/* 获取等级图标背景色 */
const getLevelBgColor = (level: number): string => {
  const colors: Record<number, string> = {
    1: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    2: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)',
    3: 'linear-gradient(135deg, #c0c0c0 0%, #808080 100%)',
    4: 'linear-gradient(135deg, #ffd700 0%, #daa520 100%)',
    5: 'linear-gradient(135deg, #e3e3e3 0%, #a9a9a9 100%)'
  }
  return colors[level] || colors[1]
}
</script>

<template>
  <div class="level-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">会员等级</h1>
      <p class="page-desc">持续学习，解锁更多会员权益</p>
    </div>

    <!-- 当前等级卡片 -->
    <div
      class="current-level-card"
      :style="{ background: getLevelBgColor(currentLevel?.level || 1) }"
    >
      <div class="level-info">
        <div class="level-icon">
          <Icon name="material-symbols:stars" class="icon" />
        </div>
        <div class="level-detail">
          <div class="level-name">{{ currentLevel?.name || '普通会员' }}</div>
          <div class="level-exp">当前经验值：{{ currentExperience }}</div>
        </div>
      </div>

      <!-- 等级进度 -->
      <div v-if="!levelProgress.isMaxLevel" class="level-progress">
        <div class="progress-info">
          <span class="current">{{ levelProgress.currentExp }} EXP</span>
          <span class="target">{{ levelProgress.nextLevel?.experience }} EXP</span>
        </div>
        <el-progress
          :percentage="Math.round(levelProgress.progress)"
          :color="getLevelColor(currentLevel?.level || 1)"
          :stroke-width="12"
          :show-text="false"
        />
        <div class="progress-hint">
          还需 {{ levelProgress.needExp }} 经验值升级{{ levelProgress.nextLevel?.name }}
        </div>
      </div>

      <div v-else class="max-level-badge">
        <Icon name="material-symbols:verified" class="badge-icon" />
        <span>已达最高等级</span>
      </div>
    </div>

    <!-- 等级权益列表 -->
    <div class="level-list-section">
      <h3 class="section-title">等级权益</h3>
      <div class="level-list">
        <div
          v-for="level in levelStore.levelList"
          :key="level.level"
          class="level-item"
          :class="{ active: level.level === currentLevel?.level }"
        >
          <div class="level-header">
            <div
              class="level-badge"
              :style="{ background: getLevelBgColor(level.level) }"
            >
              <Icon name="material-symbols:stars" class="badge-icon" />
            </div>
            <div class="level-title">
              <div class="name">{{ level.name }}</div>
              <div class="exp">{{ level.experience }} EXP</div>
            </div>
          </div>
          <div class="level-benefits">
            <div class="benefit-item">
              <Icon name="material-symbols:local-offer" class="benefit-icon" />
              <span>购物 {{ levelStore.getDiscountText(level.discountPercent) }}</span>
            </div>
          </div>
          <div v-if="level.level === currentLevel?.level" class="current-tag">
            当前等级
          </div>
        </div>
      </div>
    </div>

    <!-- 经验记录 -->
    <div class="experience-section">
      <h3 class="section-title">经验记录</h3>
      <div v-if="levelStore.experienceRecords.length === 0" class="empty-state">
        <el-empty description="暂无经验记录" />
      </div>
      <div v-else class="experience-list">
        <div
          v-for="record in levelStore.experienceRecords"
          :key="record.createTime"
          class="experience-item"
        >
          <div class="experience-icon">
            <Icon name="material-symbols:add-circle" class="icon" />
          </div>
          <div class="experience-content">
            <div class="experience-title">{{ record.title }}</div>
            <div class="experience-desc">{{ record.description }}</div>
          </div>
          <div class="experience-meta">
            <div class="experience-value">+{{ record.experience }}</div>
            <div class="experience-time">{{ record.createTime }}</div>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div
        v-if="levelStore.experienceRecords.length < levelStore.experienceTotal"
        class="load-more"
      >
        <el-button :loading="levelStore.loading" @click="loadMore">
          加载更多
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.level-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }

  .page-desc {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }
}

.current-level-card {
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

  .level-info {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;

    .level-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(10px);

      .icon {
        font-size: 32px;
      }
    }

    .level-detail {
      .level-name {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .level-exp {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }

  .level-progress {
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
      opacity: 0.9;
    }

    :deep(.el-progress__bar) {
      background-color: rgba(255, 255, 255, 0.3);
    }

    :deep(.el-progress-bar__inner) {
      background-color: white !important;
    }

    .progress-hint {
      margin-top: 8px;
      font-size: 13px;
      text-align: center;
      opacity: 0.9;
    }
  }

  .max-level-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    backdrop-filter: blur(10px);

    .badge-icon {
      font-size: 20px;
    }

    span {
      font-size: 16px;
      font-weight: 500;
    }
  }
}

.level-list-section {
  margin-bottom: 24px;

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 16px;
  }

  .level-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;

    .level-item {
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-light);
      border-radius: 12px;
      padding: 20px;
      position: relative;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      &.active {
        border-color: var(--el-color-primary);
        box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
      }

      .level-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .level-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;

          .badge-icon {
            font-size: 24px;
          }
        }

        .level-title {
          .name {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 4px;
          }

          .exp {
            font-size: 13px;
            color: var(--el-text-color-secondary);
          }
        }
      }

      .level-benefits {
        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--el-text-color-regular);

          .benefit-icon {
            font-size: 16px;
            color: var(--el-color-success);
          }
        }
      }

      .current-tag {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 4px 12px;
        background: var(--el-color-primary);
        color: white;
        font-size: 12px;
        border-radius: 12px;
      }
    }
  }
}

.experience-section {
  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 16px;
  }

  .empty-state {
    padding: 48px 0;
  }

  .experience-list {
    background: var(--el-bg-color);
    border-radius: 12px;
    border: 1px solid var(--el-border-color-light);

    .experience-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--el-border-color-light);

      &:last-child {
        border-bottom: none;
      }

      .experience-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--el-color-success-light-9);
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
          font-size: 20px;
          color: var(--el-color-success);
        }
      }

      .experience-content {
        flex: 1;

        .experience-title {
          font-size: 15px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;
        }

        .experience-desc {
          font-size: 13px;
          color: var(--el-text-color-secondary);
        }
      }

      .experience-meta {
        text-align: right;

        .experience-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-color-success);
          margin-bottom: 4px;
        }

        .experience-time {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 24px 0;
  }
}

@media (max-width: 768px) {
  .level-page {
    padding: 16px;
  }

  .current-level-card {
    padding: 20px;

    .level-info {
      .level-icon {
        width: 48px;
        height: 48px;

        .icon {
          font-size: 24px;
        }
      }

      .level-detail {
        .level-name {
          font-size: 18px;
        }
      }
    }
  }

  .level-list-section {
    .level-list {
      grid-template-columns: 1fr;
    }
  }
}
</style>
