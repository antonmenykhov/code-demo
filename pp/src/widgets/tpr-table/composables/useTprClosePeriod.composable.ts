import useLocksHttp from '@/composables/http/use-locks-http.composable'
import { ref, type Ref } from 'vue'

export default function useTprClosePeriod(year: Ref<number>) {
  const openedPeriod = ref<[number, number]>([1, 12])

  const { getTprClosePeriod, updateTprClosedPeriod } = useLocksHttp()

  async function getOpenedPeriod() {
    return getTprClosePeriod(year.value).then(({ data }) => {
      openedPeriod.value[0] = data.closeMonth
    })
  }

  async function updateOpenedPeriod(newVal: number) {
    return updateTprClosedPeriod(year.value, newVal)
  }

  return { openedPeriod, getOpenedPeriod, updateOpenedPeriod }
}
