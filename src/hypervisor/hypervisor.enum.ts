/**
 * Possible states of the scrapper, used for indicate status
 */
export enum HypervisorScrapperState {
  STARTING = 'start',
  REGISTRATION = 'register',
  READY = 'ready',
  WORKING = 'work',
  ERRORED = 'err',
  DISCONNECTED = 'disconnect',
}

/**
 * Commands that represts certian tasks
 */
export enum HypervisorScrapperCommands {
  DISCONNECT = 'disconnect',
  SCRAP = 'scrap',
}

/**
 * Events related to the communnication hypervisor <-> scrapper
 */
export enum HypervisorEvents {
  STATE = 'state-update', // send scrapper state
  PASSPORT = 'passport', // send passport and wait for disposition
  VISA = 'visa', // dispositon ready, accepted or not
  COMMAND = 'cmd', // disposition of running command (scrap, cancel, restart, etc.)
  SCHEDULE = 'schedule-update',
}
