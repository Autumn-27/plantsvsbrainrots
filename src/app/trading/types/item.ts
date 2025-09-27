export type PvbCategory = 'plant' | 'brainrot'

export interface PvbPlantItem {
  category: 'plant'
  item_id: string
  quantity: number
  damage?: number | null
  weight?: number | null
  mutations?: string | null
}

export interface PvbBrainrotItem {
  category: 'brainrot'
  item_id: string
  quantity: number
  normal?: number | null
  mutations?: string | null
}

export type PvbTradeItem = PvbPlantItem | PvbBrainrotItem

export interface PvbUser {
  id: string
  username: string | null
  image: string | null
  profile_url: string | null
}

export interface PvbTradeDTO {
  id: number
  user: PvbUser | null
  remark: string | null
  status?: 'ongoing' | 'completed'
  created_at: string
  have: Omit<PvbTradeItem, 'category'>[] & PvbTradeItem[]
  want: Omit<PvbTradeItem, 'category'>[] & PvbTradeItem[]
}



