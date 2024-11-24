import { defineStore } from 'pinia'

export type BrowseLayout = 'grid' | 'list' | 'thumb'
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    hideSidebar: false,
    browse: {
      layout: 'grid' as BrowseLayout,
      basis: 0 as number,
    },
  }),

  actions: {
    setLayout(layout: BrowseLayout) {
      this.browse.layout = layout
    },

    setBasis(basis: number) {
      this.browse.basis = basis
    },
  },
  persist: {
    pick: ['browse'],
  },
})
