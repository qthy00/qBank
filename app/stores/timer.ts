import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UUIDGenerator } from '@/utils/uuidUtils'

// 单个计时器接口定义
interface TimerInstance {
  id: string;
  name: string;
  timeMode: 'countdown' | 'countup';
  durationMinutes: number;
  totalSeconds: number;
  currentSeconds: number;
  timerInstance: NodeJS.Timeout | null;
  isRunning: boolean;
  isPaused: boolean;
}

// 创建组合式Store - 支持多个计时器实例
export const useTimerStore = defineStore('timer', () => {
  // 存储所有计时器实例
  const timers = ref<TimerInstance[]>([]);

  // 创建新计时器
  const createTimer = (
    options: Partial<Omit<TimerInstance, 'id' | 'timerInstance' | 'isRunning' | 'isPaused'>> = {}
  ) => {
    const newTimer: TimerInstance = {
      id: UUIDGenerator.generateV4(),
      name: options.name || `计时器 ${timers.value.length + 1}`,
      timeMode: options.timeMode || 'countdown',
      durationMinutes: options.durationMinutes || 60,
      totalSeconds: (options.durationMinutes || 60) * 60,
      currentSeconds: options.timeMode === 'countup' ? 0 : (options.durationMinutes || 60) * 60,
      timerInstance: null,
      isRunning: false,
      isPaused: false
    };

    timers.value.push(newTimer);
    return newTimer.id;
  };

  // 获取单个计时器
  const getTimer = (id: string) => {
    return timers.value.find(timer => timer.id === id);
  };

  // 格式化时间显示
  const formatTime = (seconds: number, totalSeconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // 补零函数
    const padZero = (num: number) => num.toString().padStart(2, '0');

    // 根据总时长决定显示格式
    return totalSeconds >= 3600
      ? `${padZero(hours)}:${padZero(minutes)}:${padZero(secs)}`
      : `${padZero(minutes)}:${padZero(secs)}`;
  };

  // 检查是否需要显示警告
  const isTimeWarning = (timer: TimerInstance) => {
    console.log('currentSeconds', timer.currentSeconds)
    return timer.timeMode === 'countdown' &&
      timer.currentSeconds > 0 &&
      timer.currentSeconds <= 15 * 60;
  };

  // 启动计时器
  const startTimer = (id: string) => {
    const timer = getTimer(id);
    if (!timer) return;


    timer.isRunning = true;
    timer.isPaused = false;

    timer.timerInstance = setInterval(() => {
      if (timer.timeMode === 'countdown') {
        if (timer.currentSeconds <= 0) {
          stopTimer(id);
          // 可以在这里添加倒计时结束的通知
          return;
        }
        timer.currentSeconds--;
      } else {
        // 正计时可以设置上限或无限计时
        if (timer.currentSeconds >= timer.totalSeconds) {
          stopTimer(id);
          // 可以在这里添加正计时结束的通知
          return;
        }
        timer.currentSeconds++;
      }
    }, 1000);
  };

  // 停止计时器
  const stopTimer = (id: string) => {
    const timer = getTimer(id);
    if (!timer) return;

    if (timer.timerInstance) {
      clearInterval(timer.timerInstance);
      timer.timerInstance = null;
    }

    timer.isRunning = false;
    timer.isPaused = true;
  };

  // 重置计时器
  const resetTimer = (id: string) => {
    const timer = getTimer(id);
    if (!timer) return;

    stopTimer(id);
    timer.currentSeconds = timer.timeMode === 'countdown'
      ? timer.totalSeconds
      : 0;
    timer.isPaused = false;
  };

  // 删除计时器
  const deleteTimer = (id: string) => {
    // 先停止计时器再删除
    stopTimer(id);
    timers.value = timers.value.filter(timer => timer.id !== id);
  };

  // 更新计时器设置
  const updateTimerSettings = (
    id: string,
    settings: Partial<Omit<TimerInstance, 'id' | 'timerInstance' | 'isRunning' | 'isPaused'>>
  ) => {
    const timer = getTimer(id);
    if (!timer) return;

    // 停止计时器再更新设置
    const wasRunning = timer.isRunning;
    stopTimer(id);

    if (settings.name !== undefined) timer.name = settings.name;
    if (settings.timeMode !== undefined) timer.timeMode = settings.timeMode;
    if (settings.durationMinutes !== undefined) {
      timer.durationMinutes = settings.durationMinutes;
      timer.totalSeconds = settings.durationMinutes * 60;
    }

    // 重置当前秒数
    timer.currentSeconds = timer.timeMode === 'countdown'
      ? timer.totalSeconds
      : 0;

    // 如果之前是运行状态，更新后继续运行
    if (wasRunning) {
      startTimer(id);
    }
  };

  // 停止所有计时器
  const stopAllTimers = () => {
    timers.value.forEach(timer => {
      stopTimer(timer.id);
    });
  };

  // 删除所有计时器
  const deleteAllTimers = () => {
    stopAllTimers();
    timers.value = [];
  };

  return {
    timers,
    createTimer,
    getTimer,
    formatTime,
    isTimeWarning,
    startTimer,
    stopTimer,
    resetTimer,
    deleteTimer,
    updateTimerSettings,
    stopAllTimers,
    deleteAllTimers
  };
}, {
  // 持久化配置
  persist: {
    // 自定义序列化，过滤掉定时器实例
    serializer: {
      serialize: (value) => {
        // 复制一份数据并移除定时器实例
        const copy = { ...value };
        if (copy.timers) {
          copy.timers = copy.timers.map((timer: any) => {
            const timerCopy = { ...timer };
            delete timerCopy.timerInstance;
            return timerCopy;
          });
        }
        return JSON.stringify(copy);
      },
      deserialize: (value) => JSON.parse(value)
    }
  }
});
