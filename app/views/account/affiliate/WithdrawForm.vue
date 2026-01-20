<script setup lang="ts">
import { fen2yuan } from '~/utils/money.ts'
import {
  type AffiliateUserInfoVO, type AffiliateWithdrawReqVO,
  createAffiliateWithdraw,
  getAffiliateUserInfo
} from '~/api/user/affiliate.ts'
import { getSwapConfig, type SwapConfig } from '~/api/order'
import { getDictDataListByType } from '~/api/dict/dict.data.ts'

defineOptions({ name: 'WithdrawForm' })

const message = useMessage()

const dialogVisible = ref(false)
const brokeragePrice = ref(0)

const state = reactive({
  minPrice: 0,
  withdrawTypes: [],
  frozenDays: 0,
  affiliateInfo: {} as AffiliateUserInfoVO, // 分销信息
  bankList: [] as {label: string, value: string}[],
})
const formLoading = ref(false)
const formData = ref<AffiliateWithdrawReqVO>({
  price: undefined,
  type: undefined,
  userAccount: '',
  qrCodeUrl: [],
  userName: '',
  bankName: '',
  bankAddress: '',
})
const formRules = reactive({
  price: [{ required: true, validator: (rule, value, callback) => {
      // 先判断是否为有效数字
      if (isNaN(Number(value))) {
        callback(new Error('请输入数字'));
      }
      // 再判断是否大于0
      else if (Number(value) <= 0) {
        callback(new Error('金额必须大于0'));
      }
      // 验证通过
      else {
        callback();
      }
    }, trigger: 'blur' }],
  type: [{ required: true, message: '请选择支付方式', trigger: 'blur' }],
  qrCodeUrl: [{ required: true, validator:( rule, value, callback) => {
      if([3, 4].includes(Number(formData.value.type)) && value.length === 0){
        callback(new Error('请上传收款码'))
      } else {
        callback()
      }
    }, trigger: 'blur' }],
  userAccount: [{ required: true, validator:( rule, value, callback) => {
      if([2, 6].includes(Number(formData.value.type)) && value.trim() === ''){
        callback(new Error('请输入提现账号'))
      } else {
        callback()
      }
    }, trigger: 'blur' }],
  userName: [{ required: true, validator:( rule, value, callback) => {
      if([2, 5, 6].includes(Number(formData.value.type)) && value.trim() === ''){
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }, trigger: 'blur' }],
  bankName: [{ required: true, validator:( rule, value, callback) => {
      if(formData.value.type === 2 && value.trim() === ''){
        callback(new Error('请选择/输入银行名'))
      } else {
        callback()
      }
    }, trigger: 'blur' }],
  bankAddress: [{ required: true, validator:( rule, value, callback) => {
      if(formData.value.type === 2 && value.trim() === ''){
        callback(new Error('请输入银行开户地址'))
      } else {
        callback()
      }
    }, trigger: 'blur' }],
})
const typeList = ref([
  {
    label: '账户钱包',
    value: 1,
  },
  {
    label: '银行卡转账',
    value: 2,
  },
  {
    label: '微信收款码',
    value: 3,
  },
  {
    label: '支付宝收款码',
    value: 4,
  },
  {
    label: '微信账户',
    value: 5,
  },
  {
    label: '支付宝账户',
    value: 6,
  },

])
const formRef = ref()
/** 打开弹窗 */
const open = async (brokerage: number) => {
  brokeragePrice.value = brokerage
  formData.value.price = 0
  dialogVisible.value = true
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const emit = defineEmits(['success'])
const onConfirm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    if(!formData.value.price) return
    await message.confirm(`确定将 ${formData.value.price} 元佣金转到余额中吗？`, '提示')
    const data = {
      ...formData.value,
      price: formData.value.price * 100,
      qrCodeUrl: formData.value.qrCodeUrl[0] || '',
    }
    if([2, 6].includes(Number(formData.value.type))){
      delete data.transferChannelCode
    } else {
      delete data.userAccount
      delete data.transferChannelCode
    }
    await createAffiliateWithdraw(data)
    emit('success')
    message.success('您的提现申请已成功提交')
    dialogVisible.value = false
  } catch (e) {
    console.log(e)
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    price: undefined,
    type: undefined,
    userAccount: '',
    qrCodeUrl: [],
    userName: '',
    bankName: '',
    bankAddress: '',
  }
  formRef.value?.resetFields()
}

const getWithdrawRules = async () => {
  let data = (await getSwapConfig()) as SwapConfig

  if (data) {
    state.minPrice = data.brokerageWithdrawMinPrice || 0
    state.frozenDays = data.brokerageFrozenDays || 0

    typeList.value = typeList.value.filter((item) => data.brokerageWithdrawTypes.includes(item.value))
  }
}
const getAffiliateUser = async () => {
    const data = await getAffiliateUserInfo() as AffiliateUserInfoVO
    if (data) {
      state.affiliateInfo = data
    }
}
const getBankList = async () => {
  const data = await getDictDataListByType('brokerage_bank_name')
  if (data && data.length > 0) {
    state.bankList = data.reverse()
  }
}

onMounted(async () => {
  await Promise.all([
    getWithdrawRules(),
    getAffiliateUser(),
    getBankList()
  ])
})
</script>

<template>
  <!-- 转余额弹窗 -->
  <Dialog v-model="dialogVisible" title="申请提现" width="40%" :scroll="false">
    <div class="py-4">
      <div class="flex justify-between">
        <p class="font-bold text-xl">
          可提现金额
        </p>
        <span class="text-3xl text-red-500 font-bold">
         {{ fen2yuan(brokeragePrice || 0) }} 元
      </span>
      </div>


      <el-divider />
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        v-loading="formLoading"
        label-position="right"
        label-width="110px">
        <el-form-item label="提现至" prop="type">
          <el-select v-model="formData.type" placeholder="请选择提现方式">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="提现金额(￥)" prop="price">
          <el-input-number
            v-model="formData.price"
            controls-position="right"
            placeholder="请输入金额"
            :precision="2"
            class="text-3xl border-0 focus:ring-0"
            :max="brokeragePrice / 100"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="提现账号" v-if="[2, 6].includes(formData.type || 0)" prop="userAccount">
          <el-input v-model="formData.userAccount" placeholder="请输入提现账号" />
        </el-form-item>
        <!-- 收款码 -->
        <el-form-item label="收款码" v-if="[3, 4].includes(formData.type || 0)" prop="qrCodeUrl">
          <UploadImg
            v-model="formData.qrCodeUrl"
            :limit="1"
            height="80px"
            width="80px"
          />
        </el-form-item>
        <!-- 持卡人姓名 -->
        <el-form-item label="收款真名" v-if="[2, 5, 6].includes(formData.type || 0)" prop="userName">
          <el-input v-model="formData.userName" placeholder="请输入姓名" />
        </el-form-item>
        <template v-if="formData.type === 2">
          <!-- 银行卡号 -->
          <el-form-item label="提现银行" prop="bankName">
            <el-select
              v-model="formData.bankName"
              filterable
              allow-create
              default-first-option
              placeholder="请输入提现银行"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="item in state.bankList"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <!-- 开户地址 -->
          <el-form-item label="开户地址" prop="bankAddress">
            <el-input v-model="formData.bankAddress" placeholder="请输入开户地址" />
          </el-form-item>
        </template>
      </el-form>
    </div>

    <el-card title="提现说明" shadow="never" class="mt-4 rounded-2xl" >
      <p class="mb-2">最低提现金额 {{ fen2yuan(state.minPrice) }} 元 </p>
      <p>
        冻结佣金：
        <el-text>￥{{ fen2yuan(state.affiliateInfo.frozenPrice) }}</el-text>
        （每笔佣金的冻结期为 {{ state.frozenDays }} 天，到期后可提现）
      </p>
    </el-card>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onConfirm" :disabled="formData.price == 0">确认提现</el-button>
    </template>
  </Dialog>
</template>

<style scoped></style>
