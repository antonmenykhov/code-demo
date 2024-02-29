import type { TableRow } from '@/interfaces/table-row.interface';
import { ref, computed, watch, type Ref } from 'vue';

export default function usePaging(filteredRows: Ref<TableRow[]>) {
  const pageSize = ref(25);
  const currentPage = ref(1);
  const maxPage = computed(() =>
    Math.ceil(filteredRows.value.length / pageSize.value),
  );
  watch(maxPage, (newVal) => {
    if (newVal < currentPage.value) {
      currentPage.value = 1;
    }
  });
  const rowsPaged = computed(() =>
    filteredRows.value.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value,
    ),
  );
  return { pageSize, currentPage, maxPage, rowsPaged };
}
