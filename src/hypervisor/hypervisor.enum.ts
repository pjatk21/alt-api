export enum HypervisorScrapperState {
  STARTING,
  REGISTRATION,
  READY,
  WORKING,
  BROKEN,
  DISCONNECTED,
}

export enum HypervisorScrapperCommands {
  DISCONNECT = 'disconnect',
  EXIT = 'exit',
  SCRAP = 'scrap',
  QUEUE = 'queue',
  CANCEL = 'cancel',
}

export enum HypervisorEvents {
  STATE = 'state-update', // send scrapper state
  PASSPORT = 'passport', // send passport and wait for disposition
  VISA = 'visa', // dispositon ready, accepted or not
  COMMAND = 'cmd', // disposition of running command (scrap, cancel, restart, etc.)
}
