export interface TransformationType {
  slug: string
  label: string
  description: string
  icon: string
  sortOrder: number
}

export interface TransformationTypesResponse {
  success: boolean
  data: TransformationType[]
}
