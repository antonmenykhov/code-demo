export interface Version {
  admin_user_id: null | number
  comment: null | string
  date_end: string
  deleted: boolean
  deleted_by: null | string
  id: number | string
  is_actual: boolean
  modified_by: null | string
  name: string
  'version_status.deleted': boolean
  'version_status.deleted_by': null | string
  'version_status.modified_by': null | string
  'version_status.name': string
  version_status_id: number
}
