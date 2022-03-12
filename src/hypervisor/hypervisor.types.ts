import { HypervisorScrapperCommands } from './hypervisor.enum'

export type HypervisorScrapArgs =
  | { daysAhead?: number }
  | { numberOfEntriesAhead?: number }
  | { scrapUntil?: Date }

export type HypervisorCommandExec = {
  command: HypervisorScrapperCommands
  context: HypervisorScrapArgs | null
}
