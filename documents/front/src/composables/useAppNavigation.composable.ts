import { computed, type Component, ref, onMounted } from 'vue'
import {
  DownloadOutlined,
  UploadOutlined,
  TeamOutlined,
  ShopOutlined,
  AuditOutlined,
  BankFilled,
  MailOutlined
} from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notificationStore'
import { storeToRefs } from 'pinia'

export type NavigationItem = {
  path: string
  caption: string
  iconComponent: Component
  count?: number
}

export default function useAppNavigation() {
  const { getDocs } = useNotificationStore()
  const { counts } = storeToRefs(useNotificationStore())
  getDocs()
  const navigationElements = computed<NavigationItem[]>(() => [
    {
      path: '/documents/in',
      caption: 'Входящие',
      iconComponent: DownloadOutlined,
      count: counts.value.in
    },
    {
      path: '/documents/out',
      caption: 'Исходящие',
      iconComponent: UploadOutlined,
      count: counts.value.out
    },
    {
      path: '/delegations',
      caption: 'Поручения',
      iconComponent: AuditOutlined
    },
    {
      path: '/contractors',
      caption: 'Контрагенты',
      iconComponent: BankFilled
    },
    {
      path: '/companies',
      caption: 'Компании',
      iconComponent: ShopOutlined
    },
    {
      path: '/emails',
      caption: 'Почтовые ящики',
      iconComponent: MailOutlined
    },
    {
      path: '/staff',
      caption: 'Сотрудники',
      iconComponent: TeamOutlined
    }
  ])

  const router = useRouter()
  function onMenuItemClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    const liTarget = target.classList.contains('ant-menu-item')
      ? target
      : target.closest('.ant-menu-item')
    if (e.type === 'click') {
      if (liTarget && (liTarget as HTMLElement).dataset.menuId !== undefined) {
        const menuItem = navigationElements.value[+((liTarget as HTMLElement).dataset.menuId || 0)]
        router.push({
          path: menuItem.path
        })
      }
    }
  }

  const route = useRoute()
  const selectedKeys = ref<number[]>([])
  function setInitialKeys() {
    const menuItem = navigationElements.value.findIndex((elem) => elem.path === route.path)
    if (menuItem !== -1) {
      selectedKeys.value.push(menuItem)
    }
  }
  onMounted(() => {
    setTimeout(() => {
      setInitialKeys()
    }, 100)
  })

  return { navigationElements, onMenuItemClick, selectedKeys }
}
