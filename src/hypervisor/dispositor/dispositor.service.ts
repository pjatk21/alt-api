import { Injectable, Logger } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { DateTime, Duration, DurationLikeObject } from 'luxon'
import { HypervisorScrapArgs } from '../hypervisor.types'
import {
  HypervisorEvents,
  HypervisorScrapperCommands,
  HypervisorScrapperState,
} from '../hypervisor.enum'
import { HypervisorService } from '../hypervisor.service'

/**
 * Type representing task rule.
 */
type TaskDisposition = {
  /**
   * Name of the task, should be unique
   */
  name: string
  /**
   * Priority of the task
   */
  priority: number
  /**
   * Delay between runs
   */
  runNewAfter: DurationLikeObject
  /**
   * Function which can dynamicly define aruments for the scrappers
   */
  argsFactory: () => HypervisorScrapArgs
}

const tasks: TaskDisposition[] = [
  {
    name: 'fetch to the end of the week',
    priority: 50,
    runNewAfter: { minutes: 45 },
    argsFactory: () => ({
      scrapUntil: DateTime.now().endOf('week').toJSDate(),
    }),
  },
  {
    name: 'fetch next 5 days',
    priority: 45,
    runNewAfter: { hour: 6 },
    argsFactory: () => ({
      scrapUntil: DateTime.now().plus({ days: 5 }).toJSDate(),
    }),
  },
  {
    name: 'fetch next 21 days',
    priority: 40,
    runNewAfter: { hour: 12 },
    argsFactory: () => ({
      scrapStart: DateTime.now().plus({ days: 5 }).toJSDate(),
      scrapUntil: DateTime.now().plus({ days: 21 }).toJSDate(),
    }),
  },
  {
    name: 'fetch backlog',
    priority: 60,
    runNewAfter: { weeks: 4 },
    argsFactory: () => ({
      scrapStart: DateTime.now().minus({ months: 5 }).toJSDate(),
      scrapUntil: DateTime.now().toJSDate(),
    }),
  },
  {
    name: 'fetch to the end of the 2022',
    priority: 10,
    runNewAfter: { day: 1 },
    argsFactory: () => ({
      scrapStart: DateTime.now().plus({ days: 21 }).toJSDate(),
      scrapUntil: DateTime.fromObject({ year: 2023, month: 2, day: 14 }).toJSDate(),
    }),
  },
]

/**
 * The only responsiblity of this service is sending new tasks to scrappers.
 * In future, also will generate tasks dynamically.
 * For now, tasks aren't presistent. That means, after restart of app, tasks will start over again.
 */
@Injectable()
export class DispositorService {
  private readonly logger = new Logger(DispositorService.name)
  // client id -> task name
  private activeTasks: Map<string, string> = new Map()
  // task name -> last update datetime
  private taskLastRun: Map<string, DateTime> = new Map()

  constructor(private readonly hypervisor: HypervisorService) {
    // Populate last runs
    for (const task of tasks) this.taskLastRun.set(task.name, DateTime.fromMillis(0))
  }

  /**
   * Handle case where scrapper disconnects while awaiting/doing task.
   * @param client
   * @param server
   */
  public async cleanupOnDisconnect(client: Socket, server: Server) {
    if (this.activeTasks.has(client.id)) {
      this.logger.warn(
        `Scrapper disconnected while awaiting for new task! Trying to disptach this task to new scrapper...`,
      )
      this.activeTasks.delete(client.id)

      const readyHypervisors = await this.hypervisor.getScrappersByState(
        HypervisorScrapperState.READY,
      )

      if (readyHypervisors.length > 0) {
        this.logger.log(`Found ${readyHypervisors.length} ready scrappers.`)
        this.logger.log(`Choosing ${readyHypervisors[0].name}...`)

        await this.assignTask(server.sockets.sockets.get(readyHypervisors[0].socket))
      }
    }
  }

  /**
   * Get time to run next task.
   * @param task
   * @returns
   */
  private getRunIn(task: TaskDisposition) {
    if (this.taskLastRun.has(task.name))
      return this.taskLastRun.get(task.name).diffNow().plus(task.runNewAfter)
  }

  /**
   * Dispatches new task depending on priority and avaliablity
   * @returns
   */
  private getNextTask(): [TaskDisposition | null, number | null] {
    const tasksAvailable = tasks
      .sort((x, y) => y.priority - x.priority)
      .filter((t) => !Array.from(this.activeTasks.values()).includes(t.name))

    for (const task of tasksAvailable) {
      const lastRun = this.taskLastRun.get(task.name)
      if (lastRun.diffNow().negate() > Duration.fromDurationLike(task.runNewAfter)) {
        this.logger.log(`Disposing to run "${task.name}"`)
        return [task, null]
      }
    }

    this.logger.warn('All task are satified! Trying to find most prioritised task...')
    const mostPrioritised = tasksAvailable[0]
    if (mostPrioritised) {
      const runIn = this.getRunIn(mostPrioritised)
      this.logger.log(`Disposing to run "${mostPrioritised.name}"`)

      return [mostPrioritised, runIn.as('milliseconds')]
    }

    this.logger.warn('All tasks are running! None task disposed!')
    return [null, null]
  }

  /**
   * Gets dispatched task, and assings this task to scrapper.
   * @param client
   * @returns
   */
  public async assignTask(client: Socket) {
    const [task, startIn] = this.getNextTask()

    if (task === null) return

    this.activeTasks.set(client.id, task.name)
    const arg = task.argsFactory()

    if (startIn) {
      const d = Duration.fromMillis(startIn)
      this.logger.log(
        `Delay ${d
          .shiftTo('hours', 'minutes', 'seconds')
          .toHuman({ listStyle: 'short' })} for task "${task.name}", disposed to ${client.id}`,
      )
      await this.hypervisor.updateState(client.id, HypervisorScrapperState.AWAITING)
    }

    setTimeout(() => {
      // note: client might disconnect while waiting for new disposition
      if (client.connected)
        client.emit(HypervisorEvents.COMMAND, HypervisorScrapperCommands.SCRAP, arg)
    }, startIn ?? 1000)
  }

  /**
   * After receiving status update from scrapper, releases task and makes it available
   * for other scrappers.
   * @param client
   * @returns
   */
  public async releaseTask(client: Socket) {
    if (!this.activeTasks.has(client.id)) return

    this.logger.log(
      `Releasing task "${this.activeTasks.get(client.id)}" from socket ${client.id}`,
    )
    const taskName = this.activeTasks.get(client.id)
    if (taskName) {
      this.logger.log(`Marking task "${taskName}" as done`)
      this.activeTasks.delete(client.id)
      this.taskLastRun.set(taskName, DateTime.now())
    }
  }
}
