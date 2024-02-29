import type { BuisnessTrip } from '@/interfaces/buisness-trip.interface'
import { handbooksStore } from '@/store/hanbooks.store'
import { useRoute } from 'vue-router'
import type { FormInputData } from './useTripCardInOut'

export default function useTripCardModelTransformer() {
  const handbookStore = handbooksStore()
  const route = useRoute()

  function transformDataFromBackend(backendData: BuisnessTrip, internalData: FormInputData) {
    const {
      id,
      city_id,
      comment,
      people_count,
      plane_ticket_plan_price,
      plane_ticket_id,
      taxi_ticket_plan_price,
      copter_ticket_plan_price,
      train_ticket_plan_price,
      train_ticket_id,
      trip_purpose_id,
      start_date,
      end_date,
      hotel_plan_price,
      grade_id,
      nights_count,
      fin_structure_id,
      reserve,
      customer_site_nights_count,
      customer_site_nights_price
    } = backendData
    const finStructureItem = handbookStore.handbooks.fin_structures.find(
      (str) => str.id === fin_structure_id
    )
    const newInternalData: FormInputData = {
      ...internalData,
      id: route.query.type === 'copy' ? 0 : id,
      dateFinish: end_date,
      dateStart: start_date,
      cityId: city_id,
      gradeId: grade_id,
      tripPurposeId: trip_purpose_id,
      comment: comment,
      peopleCount: people_count,
      hotelPrice: hotel_plan_price || null,
      hotelDuration: nights_count,
      transport: internalData.transport.map((tr) => {
        const newTr = { ...tr }
        if (tr.calcedPrice === 'taxi') {
          if (taxi_ticket_plan_price) {
            newTr.used = true
            newTr.price = taxi_ticket_plan_price
          }
        }
        if (tr.calcedPrice === 'copter') {
          if (copter_ticket_plan_price) {
            newTr.used = true
            newTr.price = copter_ticket_plan_price
          }
        }
        if (tr.calcedPrice === 'plane') {
          if (plane_ticket_id) {
            newTr.used = true
            if (plane_ticket_plan_price) {
              newTr.price = plane_ticket_plan_price
            }
          }
        }
        if (tr.calcedPrice === 'train') {
          if (train_ticket_id) {
            newTr.used = true
            if (train_ticket_plan_price) {
              newTr.price = train_ticket_plan_price
            }
          }
        }
        return newTr
      }),
      finStructureId: fin_structure_id,
      departmentName: finStructureItem?.department_name || '',
      blockName: finStructureItem?.block || '',
      reserve: reserve || 0,
      customerSiteDuration: customer_site_nights_count,
      customerSitePrice: customer_site_nights_price
    }
    return newInternalData
  }

  function transformDataToBackend(internalData: FormInputData) {
    const {
      id,
      transport,
      tripPurposeId,
      cityId,
      comment,
      peopleCount,
      hotelPrice,
      dateFinish,
      dateStart,
      gradeId,
      hotelDuration,
      finStructureId,
      reserve,
      customerSiteDuration,
      customerSitePrice
    } = internalData

    const startDateCorrected = new Date(dateStart)
    const finishDateCorrected = new Date(dateFinish)
    startDateCorrected.setHours(startDateCorrected.getHours() + 5)
    finishDateCorrected.setHours(finishDateCorrected.getHours() + 5)

    const savingData: BuisnessTrip = {
      fin_structure_id: finStructureId,
      city_id: cityId,
      start_date: JSON.parse(JSON.stringify(startDateCorrected)),
      end_date: JSON.parse(JSON.stringify(finishDateCorrected)),
      grade_id: gradeId,
      people_count: peopleCount,
      planning_period_id: 1,
      daily_payment_id:
        handbookStore.handbooks.daily_payment.find(
          (dp) => dp.city_id === cityId && gradeId === gradeId
        )?.id || null,
      daily_payment_plan_price: null,
      trip_purpose_id: tripPurposeId,
      hotel_id:
        handbookStore.handbooks.hotels.find(
          (hot) => hot.city_id === cityId && hot.grade_id === gradeId
        )?.id || null,
      hotel_plan_price: hotelPrice,
      taxi_ticket_plan_price:
        transport.find((tr) => tr.calcedPrice === 'taxi' && tr.used)?.price || null,
      copter_ticket_plan_price:
        transport.find((tr) => tr.calcedPrice === 'copter' && tr.used)?.price || null,
      train_ticket_plan_price:
        transport.find((tr) => tr.calcedPrice === 'train' && tr.used)?.price || null,
      plane_ticket_plan_price:
        transport.find((tr) => tr.calcedPrice === 'plane' && tr.used)?.price || null,
      train_ticket_id: transport.find((tr) => tr.calcedPrice === 'train' && tr.used)
        ? handbookStore.handbooks.train_tickets.find(
            (tick) => tick.city_id === cityId && tick.grade_id === gradeId
          )?.id || null
        : null,
      plane_ticket_id: transport.find((tr) => tr.calcedPrice === 'plane' && tr.used)
        ? handbookStore.handbooks.plane_tickets.find(
            (tick) => tick.city_id === cityId && tick.grade_id === gradeId
          )?.id || null
        : null,
      id,
      comment,
      nights_count: hotelDuration || 0,
      reserve: reserve,
      customer_site_nights_count: customerSiteDuration,
      customer_site_nights_price: customerSitePrice
    }

    return savingData
  }

  return { transformDataFromBackend, transformDataToBackend }
}
