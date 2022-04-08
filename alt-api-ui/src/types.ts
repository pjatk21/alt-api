/**
 * @deprecated
 */
export type ScheduleEntryRawResponse = {
  name: string
  code: string
  type: string
  groups: string[]
  building: string
  room: string
  /**
   * ISO string
   */
  begin: string
  /**
   * ISO string
   */
  end: string
  tutor: string | null
  raw?: Record<string, string>
}
