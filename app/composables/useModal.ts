
type ModalType = 'login' | 'register' | 'forgotPassword' | 'share' | 'feedback'

export const useModal = () => {

  // 存储所有弹窗的显示状态
  const modalStates = useState<Record<ModalType, boolean>>('modalStates', () => ({
    login: false,
    register: false,
    forgotPassword: false,
    share: false,
  }))

  // 打开指定弹窗
  const openModal = (type: ModalType) => {
    modalStates.value[type] = true
  }

  // 关闭指定弹窗（或全部）
  const closeModal = (type?: ModalType) => {
    if (type) {
      modalStates.value[type] = false
      if(type === 'login'){
        const {setLoginState} = useLoginState()
        setLoginState(LoginStateEnum.LOGIN)
      }

    } else {
      Object.keys(modalStates.value).forEach(key => {
        modalStates.value[key as ModalType] = false
      })
    }
  }

  return { modalStates, openModal, closeModal }
}
