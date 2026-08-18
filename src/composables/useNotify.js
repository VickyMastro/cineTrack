import { useToast } from '@nuxt/ui/composables/useToast'

export function useNotify() {
  const toast = useToast()

  function success(title, description) {
    toast.add({
      title,
      description,
      color: 'success',
      icon: 'i-heroicons-check-circle',
    })
  }

  function error(title, description) {
    toast.add({
      title,
      description,
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    })
  }

  return { success, error }
}
