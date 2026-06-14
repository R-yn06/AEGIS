export type RiskClassification = 'Low' | 'Medium' | 'High'

export type Material = {
  item_code: string
  description: string
  unit: string
  quantity: number
  unit_cost_declared: number
  baseline_unit_cost: number
  item_deviation_percent: number
}

export type Project = {
  contract_id: string
  project_title: string
  implementing_office: string
  location: string
  category_of_work: string
  approved_budget_contract: number
  contract_amount: number
  physical_target: string
  slippage_percent: number
  contractor: string
  last_updated: string
  geospatial: {
    latitude: number
    longitude: number
    region: string
    province: string
  }
  calculated_unit_cost: number
  regional_baseline_unit_cost: number
  cost_deviation_percent: number
  risk_classification: RiskClassification
  ui_theme: 'emerald' | 'amber' | 'rose'
  ai_engine_analysis: string
  citizen_upload_count: number
  bill_of_quantities_materials: Material[]
  anomaly_note?: string
}
