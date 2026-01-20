import type { Ref } from 'vue'

export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD,
  MOBILE,
  QR_CODE,
  SSO
}

export function useLoginState() {

  const currentState = useState<LoginStateEnum>('loginState', () => LoginStateEnum.LOGIN)

  function setLoginState(state: LoginStateEnum) {
    currentState.value = state
  }

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN)
  }

  return {
    setLoginState,
    currentState,
    handleBackLogin
  }
}
