import { ref } from 'vue'

export function useModalState() {
  const isOpen = ref(false)
  const editingItem = ref(null)

  function open(item = null) {
    editingItem.value = item
    isOpen.value = true
  }

  function close() {
    editingItem.value = null
    isOpen.value = false
  }

  return {
    isOpen,
    editingItem,
    open,
    close,
  }
}