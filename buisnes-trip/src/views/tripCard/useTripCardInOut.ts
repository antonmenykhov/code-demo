import useBusinessTrip from '@/composables/use-business-trip.composable'
import useServiceStaff from '@/composables/use-service-staff.composable'
import { type Ref, ref, type ComputedRef, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useTripCardModelTransformer from './useTripCardModelTransformer'
import { handbooksStore } from '@/store/hanbooks.store'
import { confirm } from '@tnnc/tnnc-ui-kit'
import type { FinStructure } from '@/interfaces/fin-structure.interface'
import { storeToRefs } from 'pinia'
import { tripStore } from '@/store/trips.store'
import type { BuisnessTrip } from '@/interfaces/buisness-trip.interface'

export type FormInputData = {
  blockName: string
  departmentName: string
  id: number
  cityId: number
  tripPurposeId: number
  gradeId: number
  peopleCount: number
  dateStart: string
  dateFinish: string
  hotelDuration: number | null
  hotelPrice: number | null
  finStructureId: number | null
  transport: {
    used: boolean
    transportName: string
    calcedPrice: 'plane' | 'train' | 'taxi' | 'copter'
    price: number | null
  }[]
  comment: string
  reserve: number
  customerSiteDuration: null | number
  customerSitePrice: null | number
}

export default function useTripCardInOut(
  clearHasChanges: () => void,
  hasChanges: Ref<boolean>,
  goToList: () => void
) {
  const { getMyPhoneBookRecord } = useServiceStaff()
  const route = useRoute()
  const { transformDataFromBackend, transformDataToBackend } = useTripCardModelTransformer()
  const { create, update, getOne } = useBusinessTrip()
  const handbookStore = handbooksStore()

  const formData: Ref<FormInputData> = ref({
    id: 0,
    cityId: 0,
    tripPurposeId: 0,
    gradeId: 1,
    peopleCount: 1,
    dateStart: '',
    dateFinish: '',
    hotelDuration: null,
    hotelPrice: null,
    customerSiteDuration: null,
    customerSitePrice: null,
    finStructureId: null,
    departmentName: '',
    transport: [
      {
        used: false,
        transportName: 'Авиа',
        calcedPrice: 'plane',
        price: null
      },
      {
        used: false,
        transportName: 'Поезд',
        calcedPrice: 'train',
        price: null
      },
      {
        used: false,
        transportName: 'Такси',
        calcedPrice: 'taxi',
        price: null
      },
      {
        used: false,
        transportName: 'Вертолет',
        calcedPrice: 'copter',
        price: null
      }
    ],
    comment: '',
    blockName: '',
    reserve: 0
  }) as Ref<FormInputData>

  async function initData(subDepartmentList: ComputedRef<FinStructure[]>) {
    if (route.params.id && isFinite(+route.params.id)) {
      formData.value = transformDataFromBackend(await getOne(+route.params.id), formData.value)
      clearHasChanges()
    } else {
      await getMyPhoneBookRecord().then((data) => {
        const depName = data.level3 || data.departmentName
        const handbookDepartment = handbookStore.handbooks.fin_structures.find(
          (str) => str.department_name === depName
        )
        formData.value.departmentName = handbookDepartment?.department_name || ''
        formData.value.blockName = handbookDepartment?.block || ''
        formData.value.finStructureId =
          subDepartmentList.value.length === 1 ? subDepartmentList.value[0].id : null
      })
    }
  }

  const { trips } = storeToRefs(tripStore())
  const { getAll } = useBusinessTrip()
  const router = useRouter()

  async function checkSameTrip(savingData: BuisnessTrip) {
    if (trips.value.length === 0) trips.value = await getAll()
    const sameTrip = trips.value.find(
      (trip) =>
        trip.fin_structure_id === savingData.fin_structure_id &&
        trip.city_id === savingData.city_id &&
        trip.grade_id === savingData.grade_id &&
        trip.start_date?.split('T')[0] === savingData.start_date?.split('T')[0] &&
        trip.end_date?.split('T')[0] === savingData.end_date?.split('T')[0] &&
        trip.train_ticket_id === savingData.train_ticket_id &&
        trip.plane_ticket_id === savingData.plane_ticket_id &&
        !!trip.taxi_ticket_plan_price === !!savingData.taxi_ticket_plan_price &&
        !!trip.copter_ticket_plan_price === !!savingData.copter_ticket_plan_price &&
        trip.id !== savingData.id
    )
    if (sameTrip) {
      confirm(
        'Не возможно ввести командировку с такими параметрами (блок, СП, МВЗ, город, грейд командируемых, даты (начала, конца), транспорт) так как такая командировка уже существует, изменить существующую?'
      )
        .then(() => {
          const pathArr = route.path.split('/')
          pathArr[2] = String(sameTrip.id)
          router.push({ path: `${pathArr.join('/')}` })
        })
        .catch(() => {
          router.push({ path: '/' })
        })
      throw 'Такая командировка уже существует!'
    }
  }

  async function save() {
    hasChanges.value = false
    const savingData = transformDataToBackend(formData.value)
    await checkSameTrip(savingData)
    if (formData.value.id === 0) {
      await create(savingData)
      confirm(confirmMessage.value)
        .then(() => {})
        .catch(() => {
          goToList()
        })
    } else {
      await update(savingData)
    }
    clearHasChanges()
  }

  const confirmMessage = computed(() =>
    route.path.includes('limit')
      ? 'Лимит сохранен. Добавить новый лимит?'
      : 'Командировка сохранена. Добавить новую командировку?'
  )

  return { formData, save, initData }
}
