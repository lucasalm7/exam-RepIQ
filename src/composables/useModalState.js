import { ref } from 'vue'

export function useModalState() {
  const isOpen = ref(false)// This line initializes a reactive reference called isOpen, which tracks the open/closed state of the modal. It starts as false, indicating that the modal is initially closed.
  const editingItem = ref(null)// This line initializes a reactive reference called editingItem, which holds the item currently being edited in the modal. It starts as null, indicating that no item is being edited.

  function open(item = null) {// This function opens the modal and optionally sets the item to be edited. If an item is provided, it will be set as the current editingItem; otherwise, editingItem will remain null.
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