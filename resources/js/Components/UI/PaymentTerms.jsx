import { usePage } from '@inertiajs/react'
import { useTrans } from '../../Utils/trans'

export default function PaymentTerms({ item }) {
    const { locale } = usePage().props
    const trans = useTrans(locale)
    const isRtl = locale === 'ar'

    if (!item) return null
    const hasInstallment = ['installment', 'both'].includes(item.payment_method)
    if (!hasInstallment || (!item.down_payment && !item.installment_years)) return null

    return (
        <div className="mt-6 pt-4 border-t border-secondary-100">
            <h2 className="text-xs font-bold text-secondary-900 mb-3">
                {isRtl ? 'أنظمة الدفع والتسهيلات' : 'Payment Terms'}
            </h2>
            <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-xl border border-secondary-100 text-xs">
                {item.down_payment && (
                    <div>
                        <span className="text-secondary-500 font-medium block mb-1">
                            {isRtl ? 'الدفعة الأولى' : 'Down Payment'}
                        </span>
                        <span className="font-bold text-secondary-950">
                            {!isNaN(item.down_payment) && !isNaN(parseFloat(item.down_payment))
                                ? Number(item.down_payment).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US') + ' ' + trans('currency_egp')
                                : item.down_payment}
                        </span>
                    </div>
                )}
                {item.installment_years && (
                    <div>
                        <span className="text-secondary-500 font-medium block mb-1">
                            {isRtl ? 'سنوات التقسيط' : 'Installment Years'}
                        </span>
                        <span className="font-bold text-secondary-950">
                            {item.installment_years} {isRtl ? 'سنوات' : 'Years'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
