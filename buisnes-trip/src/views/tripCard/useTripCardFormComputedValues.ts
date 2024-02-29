import { type Ref, computed } from 'vue'
import { handbooksStore } from '@/store/hanbooks.store'
import type { FormInputData } from './useTripCardInOut'

export default function useTripCardFormComputedValues(formData: Ref<FormInputData>) {
  const handbookStore = handbooksStore()

  const computedTripDuration = computed(() => {
    if (formData.value.dateStart !== '' && formData.value.dateFinish !== '') {
      const startDate = new Date(formData.value.dateStart).getTime()
      const finishDate = new Date(formData.value.dateFinish).getTime()
      return Math.ceil((finishDate - startDate) / (1000 * 60 * 60 * 24)) + 1
    }
    return 0
  })

  const computedHotelDuration = computed({
    get() {
      if (formData.value.hotelDuration) return formData.value.hotelDuration
      return computedTripDuration.value - 1
    },
    set(newValue: number | null) {
      if (formData.value.hotelDuration !== newValue) formData.value.hotelDuration = newValue || 0
    }
  })
  const computedHotelPrice = computed({
    get() {
      const { gradeId, cityId, hotelPrice } = formData.value
      if (hotelPrice) return hotelPrice
      if (gradeId !== 0 && cityId !== 0) {
        const hotel = handbookStore.handbooks.hotels.find(
          (h) => h.city_id === cityId && h.grade_id === gradeId
        )
        if (hotel) return +hotel.plan_price
        return 0
      }
      return 0
    },
    set(newValue: number | null) {
      formData.value.hotelPrice = newValue
    }
  })

  const computedHotelTotal = computed(
    () => (computedHotelDuration.value || 0) * (computedHotelPrice.value || 0)
  )

  const computedDailyPaymentPrice = computed(() => {
    const { cityId } = formData.value
    if (cityId !== 0) {
      const dailyPayment = handbookStore.handbooks.daily_payment.find((h) => h.city_id === cityId)
      if (dailyPayment) return +dailyPayment.plan_price
      return 0
    }
    return 0
  })

  const computedPlaneTickets = computed(() => {
    if (formData.value.cityId !== 0 && formData.value.gradeId !== 0) {
      const ticket = handbookStore.handbooks.plane_tickets.find(
        (tick) => tick.city_id === formData.value.cityId && tick.grade_id === formData.value.gradeId
      )
      if (ticket) return ticket.plan_price
      return 0
    }
    return 0
  })

  const computedTrainTickets = computed(() => {
    if (formData.value.cityId !== 0 && formData.value.gradeId !== 0) {
      const ticket = handbookStore.handbooks.train_tickets.find(
        (tick) => tick.city_id === formData.value.cityId && tick.grade_id === formData.value.gradeId
      )
      if (ticket) return ticket.plan_price
      return 0
    }
    return 0
  })

  const computedTransportPrices = computed(() => ({
    train: computedTrainTickets.value,
    plane: computedPlaneTickets.value,
    taxi: 0,
    copter: 0
  }))

  const computedCustomerSiteTotal = computed(() => {
    const { customerSiteDuration, customerSitePrice } = formData.value
    const sum = (customerSiteDuration || 0) * (customerSitePrice || 0)
    return +(isNaN(sum) ? '0' : sum.toFixed(2))
  })

  return {
    computedHotelDuration,
    computedDailyPaymentPrice,
    computedHotelPrice,
    computedTransportPrices,
    computedCustomerSiteTotal,
    computedTripDuration,
    computedHotelTotal
  }
}
