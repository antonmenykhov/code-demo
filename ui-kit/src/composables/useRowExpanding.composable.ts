import { ref } from 'vue';

export default function useRowExpanding() {
  const expandedRows = ref(new Set<string>());
  function toggleExpandingRow(rowId: string) {
    if (expandedRows.value.has(rowId)) {
      expandedRows.value.delete(rowId);
    } else {
      expandedRows.value.add(rowId);
    }
  }
  const masterDetailOpened = ref(new Set<string>());
  function toggleMasterDetail(rowId: string) {
    if (masterDetailOpened.value.has(rowId)) {
      masterDetailOpened.value.delete(rowId);
    } else {
      masterDetailOpened.value.add(rowId);
    }
  }
  return {
    toggleExpandingRow,
    expandedRows,
    masterDetailOpened,
    toggleMasterDetail,
  };
}
