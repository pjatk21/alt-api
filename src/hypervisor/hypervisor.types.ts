import { HypervisorScrapperCommands } from './hypervisor.enum'

export type HypervisorScrapArgs = {
  scrapUntil: Date
  limit?: number
  skip?: number
}

export type HypervisorCommandExec = {
  command: HypervisorScrapperCommands
  context: HypervisorScrapArgs | null
}
