/**
 * 帮助中心 Mock 数据
 */
import type {
  FAQCategoryVO,
  FAQVO,
  FAQListReqVO,
  FAQListRespVO,
  GuideCategoryVO,
  GuideVO,
  GuideListReqVO,
  GuideListRespVO,
  HelpSearchReqVO,
  HelpSearchRespVO,
  FeedbackTypeVO,
  HelpHomeVO
} from '~/types/help'

/* ==================== FAQ 分类数据 ==================== */
export const mockFAQCategories: FAQCategoryVO[] = [
  { id: 1, name: '账号相关', icon: 'ep:user', sort: 1, questionCount: 8 },
  { id: 2, name: '题库使用', icon: 'ep:document', sort: 2, questionCount: 12 },
  { id: 3, name: '考试练习', icon: 'ep:edit-pen', sort: 3, questionCount: 10 },
  { id: 4, name: '订单支付', icon: 'ep:money', sort: 4, questionCount: 6 },
  { id: 5, name: '会员权益', icon: 'ep:vip', sort: 5, questionCount: 5 },
  { id: 6, name: '其他问题', icon: 'ep:question-filled', sort: 6, questionCount: 4 }
]

/* ==================== FAQ 数据 ==================== */
export const mockFAQs: FAQVO[] = [
  /* 账号相关 */
  {
    id: 1,
    categoryId: 1,
    categoryName: '账号相关',
    question: '如何注册学次元账号？',
    answer: '您可以通过以下方式注册学次元账号：<br>1. 访问学次元官网，点击右上角"注册"按钮<br>2. 输入手机号，获取验证码<br>3. 设置登录密码<br>4. 完成注册<br><br>您也可以使用微信扫码快速注册登录。',
    sort: 1,
    viewCount: 12580,
    isHot: true,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: '账号相关',
    question: '忘记密码怎么办？',
    answer: '如果您忘记了密码，可以通过以下方式重置：<br>1. 在登录页面点击"忘记密码"<br>2. 输入注册手机号<br>3. 获取短信验证码<br>4. 设置新密码<br><br>如果您无法接收验证码，请联系客服处理。',
    sort: 2,
    viewCount: 8960,
    isHot: true,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 3,
    categoryId: 1,
    categoryName: '账号相关',
    question: '如何修改绑定的手机号？',
    answer: '修改绑定手机号的步骤如下：<br>1. 登录账号后进入"个人中心"<br>2. 点击"安全设置"<br>3. 选择"修改手机号"<br>4. 验证原手机号<br>5. 输入新手机号并验证<br>6. 完成修改<br><br>注意：新手机号不能已被其他账号绑定。',
    sort: 3,
    viewCount: 5420,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 4,
    categoryId: 1,
    categoryName: '账号相关',
    question: '如何注销账号？',
    answer: '如需注销账号，请按以下步骤操作：<br>1. 登录账号后进入"个人中心"<br>2. 点击"安全设置"<br>3. 选择"账号注销"<br>4. 阅读注销须知<br>5. 验证身份<br>6. 确认注销<br><br>注意：账号注销后，您的学习记录、收藏、订单等数据将被永久删除，请谨慎操作。',
    sort: 4,
    viewCount: 3200,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  /* 题库使用 */
  {
    id: 5,
    categoryId: 2,
    categoryName: '题库使用',
    question: '如何购买题库？',
    answer: '购买题库的步骤：<br>1. 浏览题库中心，选择您需要的题库<br>2. 点击题库进入详情页<br>3. 点击"立即购买"按钮<br>4. 选择支付方式（微信支付/支付宝）<br>5. 完成支付<br>6. 购买成功后即可使用<br><br>您也可以在购物车中添加多个题库后统一结算。',
    sort: 1,
    viewCount: 15800,
    isHot: true,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 6,
    categoryId: 2,
    categoryName: '题库使用',
    question: '已购买的题库在哪里查看？',
    answer: '您可以通过以下方式查看已购买的题库：<br>1. 登录后点击右上角头像进入"个人中心"<br>2. 在左侧菜单选择"我的题库"<br>3. 查看所有已购买的题库列表<br><br>已购买的题库会显示"已购买"标识，点击即可进入学习。',
    sort: 2,
    viewCount: 9800,
    isHot: true,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 7,
    categoryId: 2,
    categoryName: '题库使用',
    question: '如何收藏题目？',
    answer: '收藏题目的方法：<br>1. 在练习页面，点击题目右上角的"收藏"图标<br>2. 或点击"加入收藏夹"按钮<br>3. 可以选择收藏夹分类<br>4. 收藏的题目可以在"个人中心-我的收藏"中查看<br><br>您也可以批量收藏题目，方便后续复习。',
    sort: 3,
    viewCount: 6700,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 8,
    categoryId: 2,
    categoryName: '题库使用',
    question: '题库支持离线下载吗？',
    answer: '目前学次元题库暂不支持离线下载功能。但您可以将题目收藏或加入错题本，在线状态下随时查看。<br><br>我们会在后续版本中考虑增加离线下载功能，敬请期待。',
    sort: 4,
    viewCount: 4500,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  /* 考试练习 */
  {
    id: 9,
    categoryId: 3,
    categoryName: '考试练习',
    question: '如何进行模拟考试？',
    answer: '进行模拟考试的步骤：<br>1. 进入"模拟考试"页面<br>2. 选择考试科目和难度<br>3. 选择试卷类型（历年真题/模拟试卷/智能组卷）<br>4. 设置考试时长和题目数量<br>5. 点击"开始考试"<br>6. 考试完成后提交，系统会自动评分并生成考试报告<br><br>建议在安静的环境中进行模拟考试，以获得最佳的模拟效果。',
    sort: 1,
    viewCount: 11200,
    isHot: true,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 10,
    categoryId: 3,
    categoryName: '考试练习',
    question: '考试中途可以暂停吗？',
    answer: '是的，模拟考试支持中途暂停功能：<br>1. 在考试页面点击"暂停"按钮<br>2. 系统会保存当前答题进度<br>3. 您可以随时回来继续考试<br><br>注意：暂停期间计时器会暂停，但请在24小时内完成考试，否则考试将自动提交。',
    sort: 2,
    viewCount: 8200,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 11,
    categoryId: 3,
    categoryName: '考试练习',
    question: '如何查看错题解析？',
    answer: '查看错题解析的方法：<br>1. 考试结束后，在考试报告页面点击"查看解析"<br>2. 或在"个人中心-错题本"中查看<br>3. 每道错题都有详细的答案解析<br>4. 可以收藏错题以便后续复习<br><br>我们建议您定期复习错题，强化薄弱环节。',
    sort: 3,
    viewCount: 7600,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  /* 订单支付 */
  {
    id: 12,
    categoryId: 4,
    categoryName: '订单支付',
    question: '支持哪些支付方式？',
    answer: '学次元目前支持以下支付方式：<br>1. 微信支付（服务号支付、扫码支付）<br>2. 支付宝（即将上线）<br><br>支付过程安全便捷，请放心使用。',
    sort: 1,
    viewCount: 6800,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 13,
    categoryId: 4,
    categoryName: '订单支付',
    question: '支付失败怎么办？',
    answer: '如果遇到支付失败，请尝试以下方法：<br>1. 检查网络连接是否正常<br>2. 确认支付账户余额充足<br>3. 重新发起支付<br>4. 如多次失败，请联系客服处理<br><br>订单未支付成功不会扣款，您可以放心重试。',
    sort: 2,
    viewCount: 5200,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 14,
    categoryId: 4,
    categoryName: '订单支付',
    question: '如何申请退款？',
    answer: '退款申请流程：<br>1. 进入"个人中心-我的订单"<br>2. 找到需要退款的订单<br>3. 点击"申请退款"<br>4. 填写退款原因<br>5. 提交申请<br><br>退款将在3-7个工作日内原路退回，具体到账时间以银行/支付平台为准。',
    sort: 3,
    viewCount: 4800,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  /* 会员权益 */
  {
    id: 15,
    categoryId: 5,
    categoryName: '会员权益',
    question: '会员有哪些权益？',
    answer: '学次元会员享有以下权益：<br>1. 免费使用部分精品题库<br>2. 模拟考试无限次<br>3. 错题本容量扩大<br>4. 专属客服支持<br>5. 新功能优先体验<br>6. 学习数据分析报告<br>7. 专属学习资料<br><br>不同等级会员享有不同权益，等级越高权益越多。',
    sort: 1,
    viewCount: 9200,
    isHot: true,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 16,
    categoryId: 5,
    categoryName: '会员权益',
    question: '如何升级会员等级？',
    answer: '会员等级升级方式：<br>1. 累计学习时长<br>2. 完成练习题数<br>3. 考试通过次数<br>4. 参与平台活动<br><br>系统会自动根据您的学习数据计算等级，达到升级条件后自动升级。',
    sort: 2,
    viewCount: 6200,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  /* 其他问题 */
  {
    id: 17,
    categoryId: 6,
    categoryName: '其他问题',
    question: '如何联系客服？',
    answer: '您可以通过以下方式联系我们的客服：<br>1. 在线客服：工作日 9:00-18:00<br>2. 客服邮箱：support@xueciyuan.com<br>3. 客服电话：400-xxx-xxxx（工作日 9:00-18:00）<br>4. 微信公众号：学次元<br><br>我们会尽快回复您的问题。',
    sort: 1,
    viewCount: 7800,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  },
  {
    id: 18,
    categoryId: 6,
    categoryName: '其他问题',
    question: '支持哪些浏览器？',
    answer: '学次元支持以下浏览器：<br>1. Chrome 90+<br>2. Firefox 88+<br>3. Safari 14+<br>4. Edge 90+<br><br>为了获得最佳使用体验，建议您使用 Chrome 浏览器。',
    sort: 2,
    viewCount: 3400,
    isHot: false,
    createTime: '2025-01-15T10:00:00'
  }
]

/* ==================== 指南分类数据 ==================== */
export const mockGuideCategories: GuideCategoryVO[] = [
  {
    id: 1,
    name: '新手入门',
    description: '帮助新用户快速上手学次元',
    icon: 'ep:star',
    sort: 1,
    articleCount: 5
  },
  {
    id: 2,
    name: '功能指南',
    description: '详细介绍各项功能的使用方法',
    icon: 'ep:notebook',
    sort: 2,
    articleCount: 8
  },
  {
    id: 3,
    name: '学习技巧',
    description: '提升学习效率的方法和技巧',
    icon: 'ep:lamp',
    sort: 3,
    articleCount: 6
  },
  {
    id: 4,
    name: '考试攻略',
    description: '各类考试的备考攻略和经验分享',
    icon: 'ep:trophy',
    sort: 4,
    articleCount: 4
  }
]

/* ==================== 指南文章数据 ==================== */
export const mockGuides: GuideVO[] = [
  {
    id: 1,
    categoryId: 1,
    categoryName: '新手入门',
    title: '学次元快速上手指南',
    summary: '本文将帮助您在5分钟内了解学次元的核心功能，快速开始学习之旅。',
    content: `<h2>欢迎使用学次元</h2>
<p>学次元是一款专业的在线学习平台，为您提供丰富的题库资源和智能学习工具。</p>
<h3>第一步：注册登录</h3>
<p>访问学次元官网，点击右上角"注册"按钮，使用手机号快速注册。</p>
<h3>第二步：浏览题库</h3>
<p>进入题库中心，选择您感兴趣的考试科目，浏览相关题库。</p>
<h3>第三步：开始练习</h3>
<p>选择每日练习或章节练习，开始您的学习之旅。</p>
<h3>第四步：模拟考试</h3>
<p>定期进行模拟考试，检验学习成果。</p>`,
    coverImage: 'https://picsum.photos/800/400?random=1',
    author: '学次元编辑部',
    viewCount: 15800,
    sort: 1,
    isTop: true,
    publishTime: '2025-01-10 10:00:00',
    createTime: '2025-01-10T10:00:00'
  },
  {
    id: 2,
    categoryId: 1,
    categoryName: '新手入门',
    title: '如何制定学习计划',
    summary: '科学的学习计划是成功的关键，本文教您如何制定适合自己的学习计划。',
    content: `<h2>制定学习计划的要点</h2>
<p>一个好的学习计划应该具备以下特点：</p>
<ul>
<li>目标明确：明确学习目标和时间节点</li>
<li>循序渐进：由易到难，逐步提升</li>
<li>合理分配：平衡各科目的学习时间</li>
<li>留有余地：预留复习和巩固的时间</li>
</ul>`,
    coverImage: 'https://picsum.photos/800/400?random=2',
    author: '学次元编辑部',
    viewCount: 12000,
    sort: 2,
    isTop: false,
    publishTime: '2025-01-12 14:00:00',
    createTime: '2025-01-12T14:00:00'
  },
  {
    id: 3,
    categoryId: 2,
    categoryName: '功能指南',
    title: '错题本功能详解',
    summary: '充分利用错题本功能，针对性复习薄弱环节，提高学习效率。',
    content: `<h2>错题本功能介绍</h2>
<p>错题本是学次元的核心功能之一，帮助您记录和复习做错的题目。</p>
<h3>自动收录</h3>
<p>练习时做错的题目会自动收录到错题本中。</p>
<h3>分类管理</h3>
<p>您可以根据知识点、难度等维度对错题进行分类。</p>
<h3>重做功能</h3>
<p>定期重做错题，直到完全掌握。</p>`,
    coverImage: 'https://picsum.photos/800/400?random=3',
    author: '学次元编辑部',
    viewCount: 9800,
    sort: 1,
    isTop: true,
    publishTime: '2025-01-15 09:00:00',
    createTime: '2025-01-15T09:00:00'
  },
  {
    id: 4,
    categoryId: 2,
    categoryName: '功能指南',
    title: '智能组卷使用教程',
    summary: '利用智能组卷功能，根据您的学习情况自动生成个性化试卷。',
    content: `<h2>什么是智能组卷</h2>
<p>智能组卷是学次元基于AI算法开发的智能功能，能够根据您的学习数据自动生成最适合您的练习试卷。</p>`,
    coverImage: 'https://picsum.photos/800/400?random=4',
    author: '学次元编辑部',
    viewCount: 8500,
    sort: 2,
    isTop: false,
    publishTime: '2025-01-18 16:00:00',
    createTime: '2025-01-18T16:00:00'
  },
  {
    id: 5,
    categoryId: 3,
    categoryName: '学习技巧',
    title: '高效记忆法：艾宾浩斯遗忘曲线',
    summary: '了解遗忘规律，科学安排复习时间，让记忆更加牢固。',
    content: `<h2>艾宾浩斯遗忘曲线</h2>
<p>德国心理学家艾宾浩斯发现，遗忘在学习之后立即开始，而且遗忘的进程并不是均匀的。</p>`,
    coverImage: 'https://picsum.photos/800/400?random=5',
    author: '学次元编辑部',
    viewCount: 11200,
    sort: 1,
    isTop: true,
    publishTime: '2025-01-20 11:00:00',
    createTime: '2025-01-20T11:00:00'
  },
  {
    id: 6,
    categoryId: 4,
    categoryName: '考试攻略',
    title: '考前冲刺：最后一周复习策略',
    summary: '考试前最后一周如何高效复习？本文为您提供实用的冲刺策略。',
    content: `<h2>考前一周复习策略</h2>
<p>考试前的最后一周是冲刺阶段，合理的复习安排能够帮助您发挥最佳水平。</p>`,
    coverImage: 'https://picsum.photos/800/400?random=6',
    author: '学次元编辑部',
    viewCount: 13600,
    sort: 1,
    isTop: true,
    publishTime: '2025-01-22 08:00:00',
    createTime: '2025-01-22T08:00:00'
  }
]

/* ==================== 反馈类型数据 ==================== */
export const mockFeedbackTypes: FeedbackTypeVO[] = [
  { id: 1, name: '功能建议' },
  { id: 2, name: '问题反馈' },
  { id: 3, name: '内容错误' },
  { id: 4, name: '账号问题' },
  { id: 5, name: '其他' }
]

/* ==================== 查询函数 ==================== */

/**
 * 获取 FAQ 列表（Mock）
 * @param params 查询参数
 */
export const getMockFAQList = (params: FAQListReqVO): FAQListRespVO => {
  const { page = 1, pageSize = 10, categoryId, keyword } = params
  let list = [...mockFAQs]

  /* 按分类筛选 */
  if (categoryId) {
    list = list.filter(item => item.categoryId === categoryId)
  }

  /* 按关键词搜索 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(item =>
      item.question.toLowerCase().includes(lowerKeyword) ||
      item.answer.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 排序：热门 > 排序值 > 浏览量 */
  list.sort((a, b) => {
    if (a.isHot !== b.isHot) return (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0)
    if (a.sort !== b.sort) return a.sort - b.sort
    return b.viewCount - a.viewCount
  })

  /* 分页 */
  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedList = list.slice(start, end)

  return { list: paginatedList, total }
}

/**
 * 获取 FAQ 详情（Mock）
 * @param id FAQ ID
 */
export const getMockFAQDetail = (id: number): FAQVO | null => {
  const faq = mockFAQs.find(item => item.id === id)
  if (faq) {
    /* 模拟增加浏览量 */
    faq.viewCount += 1
  }
  return faq || null
}

/**
 * 获取指南列表（Mock）
 * @param params 查询参数
 */
export const getMockGuideList = (params: GuideListReqVO): GuideListRespVO => {
  const { page = 1, pageSize = 10, categoryId, keyword } = params
  let list = [...mockGuides]

  /* 按分类筛选 */
  if (categoryId) {
    list = list.filter(item => item.categoryId === categoryId)
  }

  /* 按关键词搜索 */
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    list = list.filter(item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword)
    )
  }

  /* 排序：置顶 > 排序值 > 发布时间 */
  list.sort((a, b) => {
    if (a.isTop !== b.isTop) return (b.isTop ? 1 : 0) - (a.isTop ? 1 : 0)
    if (a.sort !== b.sort) return a.sort - b.sort
    return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  })

  /* 分页 */
  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedList = list.slice(start, end)

  return { list: paginatedList, total }
}

/**
 * 获取指南详情（Mock）
 * @param id 指南 ID
 */
export const getMockGuideDetail = (id: number): GuideVO | null => {
  const guide = mockGuides.find(item => item.id === id)
  if (guide) {
    /* 模拟增加浏览量 */
    guide.viewCount += 1
  }
  return guide || null
}

/**
 * 搜索帮助内容（Mock）
 * @param params 搜索参数
 */
export const mockSearchHelp = (params: HelpSearchReqVO): HelpSearchRespVO => {
  const { keyword, type = 'all', page = 1, pageSize = 10 } = params
  const lowerKeyword = keyword.toLowerCase()
  const list: any[] = []

  /* 搜索 FAQ */
  if (type === 'all' || type === 'faq') {
    const faqResults = mockFAQs.filter(item =>
      item.question.toLowerCase().includes(lowerKeyword) ||
      item.answer.toLowerCase().includes(lowerKeyword)
    ).map(item => ({
      id: item.id,
      type: 'faq' as const,
      title: item.question,
      summary: item.answer.replace(/<[^>]+>/g, '').slice(0, 100) + '...',
      categoryName: item.categoryName,
      url: `/help/faq#${item.id}`
    }))
    list.push(...faqResults)
  }

  /* 搜索指南 */
  if (type === 'all' || type === 'guide') {
    const guideResults = mockGuides.filter(item =>
      item.title.toLowerCase().includes(lowerKeyword) ||
      item.summary?.toLowerCase().includes(lowerKeyword) ||
      item.content.toLowerCase().includes(lowerKeyword)
    ).map(item => ({
      id: item.id,
      type: 'guide' as const,
      title: item.title,
      summary: item.summary,
      categoryName: item.categoryName,
      url: `/help/guide/${item.id}`
    }))
    list.push(...guideResults)
  }

  /* 分页 */
  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return { list: list.slice(start, end), total }
}

/**
 * 获取帮助首页数据（Mock）
 */
export const getMockHelpHomeData = (): HelpHomeVO => {
  /* 获取热门FAQ */
  const hotFAQs = [...mockFAQs]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 6)

  /* 获取最新指南 */
  const recentGuides = [...mockGuides]
    .sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())
    .slice(0, 4)

  return {
    hotFAQs,
    categories: mockFAQCategories,
    guideCategories: mockGuideCategories,
    recentGuides
  }
}
