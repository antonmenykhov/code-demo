import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User, UserInfo } from '@/interfaces/user.interface'
import type { Company } from '@/interfaces/company.interface'
import type { Contractor } from '@/interfaces/contractor.interface'
import type { Email } from '@/interfaces/email.interface'

export const useHandbookStore = defineStore('handbookStore', () => {
  const users = ref<User[]>([])
  const companies = ref<Company[]>([])
  const contractors = ref<Contractor[]>([])
  const years = ref<{ year: number }[]>([])
  const emails = ref<Email[]>([])
  const userInfo = ref<UserInfo[]>([])

  return { users, companies, contractors, years, emails, userInfo }
})
