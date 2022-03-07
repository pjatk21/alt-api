import { HypervisorScrapperCommands } from './hypervisor.enum'

export type HypervisorCommandExec =
  | {
      command:
        | HypervisorScrapperCommands.DISCONNECT
        | HypervisorScrapperCommands.EXIT
        | HypervisorScrapperCommands.CANCEL
    }
  | { command: HypervisorScrapperCommands.SCRAP; numberOfDaysAhead: number }
  | { command: HypervisorScrapperCommands.SCRAP; numberOfEntriesAhead: number }
  | { command: HypervisorScrapperCommands.QUEUE; queueCommand: HypervisorCommandExec }
