
export async function useAnswerRestore(sessionId: number, answerStore: any, i18n: (key: string) => string) {
  const message = useMessage()
  const hasCache =
    answerStore.sessionId === sessionId &&
    Object.keys(answerStore.answers).length > 0

  if (hasCache) {
    try {
      await message.confirm('检测到您有未完成的测试，是否继续？', '恢复进度提示')

    } catch {
      answerStore.setPaper(sessionId)
    }
  } else {
    answerStore.setPaper(sessionId)
  }
}
