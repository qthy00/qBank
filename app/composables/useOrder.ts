import type {Order} from "~/api/order";
import {cancelOrder, deleteOrder} from "~/api/order";


export const useOrder= () => {
    const message = useMessage() // 消息弹窗
    const router = useRouter()

    /**
     * 处理订单的 button 操作按钮数组
     *
     * @param order 订单
     */
    function handleOrderButtons(order: Order) {
        order.buttons = []
        if (order.status === 0) {
            // 取消订单 / 发起支付
            order.buttons.push('cancel')
            order.buttons.push('pay')
        }
        if (order.status === 40) {
            // 删除订单
            order.buttons.push('delete')
        }
    }

    const handlePay = async (orderId: number) => {
        const fullPath = router.currentRoute.value.fullPath
        await navigateTo({
            path: '/order/pay',
            query: {
                orderId,
                returnUrl: encodeURIComponent(fullPath),
            },
        })
    }

    const handleCancel = async (id: number) => {
        try {
            await message.confirm('确定要取消订单吗？')
            await cancelOrder(id)
            message.success('订单取消成功')
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await message.confirm('确定要删除订单吗？')
            await deleteOrder(id)
            message.success('订单删除成功')
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 格式化售后状态
     *
     * @param afterSale 售后
     */
    function formatAfterSaleStatus(afterSale) {
        if (afterSale.status === 10) {
            return '申请售后';
        }
        if (afterSale.status === 40) {
            return '等待退款';
        }
        if (afterSale.status === 50) {
            return '退款成功';
        }
        if (afterSale.status === 61) {
            return '买家取消';
        }
        if (afterSale.status === 62) {
            return '商家拒绝';
        }
        return '未知状态';
    }
    /**
     * 格式化售后状态的描述
     *
     * @param afterSale 售后
     */
    function formatAfterSaleStatusDescription(afterSale) {
        if (afterSale.status === 10) {
            return '退款申请待商家处理';
        }
        if (afterSale.status === 40) {
            return '等待退款';
        }
        if (afterSale.status === 50) {
            return '退款成功';
        }
        if (afterSale.status === 61) {
            return '退款关闭';
        }
        if (afterSale.status === 62) {
            return `商家不同意退款申请，拒绝原因：${afterSale.auditReason}`;
        }
        return '未知状态';
    }

    return {
        handleOrderButtons,
        handlePay,
        handleCancel,
        handleDelete,
        formatAfterSaleStatus,
        formatAfterSaleStatusDescription
    }
}