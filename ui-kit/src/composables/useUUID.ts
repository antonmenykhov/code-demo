import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";
export default function useUUID() {
  const id = ref(uuidv4());
  return { id };
}
