import { defineStore } from 'pinia'

export const useBreadcrumbStore = defineStore('crumbs', {
  state: () => ({
    crumbs: [] as Crumb[],
    page: null as Crumb | null,
  }),

  actions: {
    setBreadcrumbs(crumbs: Crumb[]) {
      this.crumbs = crumbs
    },
    addCrumb(crumb: Crumb) {
      this.crumbs.push(crumb)
    },
    setPage(crumb: Crumb) {
      this.page = crumb
    },
  },
  persist: false,
})

export interface Crumb {
  name: string
  path?: string
}
