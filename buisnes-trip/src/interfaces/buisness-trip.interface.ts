export interface BuisnessTrip {
  city_id: number
  daily_payment_fact_price?: string | null
  daily_payment_id: number | null
  end_date: string
  grade_id: number
  hotel_fact_price?: number | null
  hotel_id: number | null
  id: number
  people_count: number
  planning_period_id: number
  start_date: string
  trip_purpose_id: number
  plane_ticket_fact_price?: number | null
  plane_ticket_id: number | null
  taxi_ticket_fact_price?: number | null
  train_ticket_fact_price?: number | null
  train_ticket_id: number | null
  comment: string
  nights_count: number | null
  fin_structure_id: number | null
  train_ticket_plan_price?: number | null
  train_ticket_prog_price?: number | null
  plane_ticket_plan_price?: number | null
  plane_ticket_prog_price?: number | null
  taxi_ticket_plan_price?: number | null
  taxi_ticket_prog_price?: number | null
  hotel_plan_price?: number | null
  hotel_prog_price?: number | null
  daily_payment_plan_price?: number | null
  daily_payment_prog_price?: number | null
  total_cost?: number
  copter_ticket_fact_price?: null | number
  copter_ticket_plan_price?: null | number
  copter_ticket_prog_price?: null | number
  reserve?: null | number
  customer_site_nights_count: null | number
  customer_site_nights_price: null | number
}
