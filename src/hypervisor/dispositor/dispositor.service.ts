import { Injectable, Logger } from '@nestjs/common'
import { Socket } from 'socket.io'
import { DateTime, Duration, DurationLikeObject } from 'luxon'
import { HypervisorScrapArgs } from '../hypervisor.types'
import { HypervisorEvents, HypervisorScrapperCommands } from '../hypervisor.enum'

type TaskDisposition = {
  name: string
  priority: number
  runNewAfter: DurationLikeObject
  argsFactory: () => HypervisorScrapArgs
}

const tasks: TaskDisposition[] = [
  {
    name: 'scrapper test',
    priority: 150,
    runNewAfter: { hours: 27 },
    argsFactory: () => ({
      scrapUntil: DateTime.now().endOf('week').toJSDate(),
      limit: 3,
    }),
  },
  {
    name: 'fetch to the end of the week',
    priority: 50,
    runNewAfter: { hour: 2 },
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
      scrapUntil: DateTime.now().plus({ days: 21 }).toJSDate(),
    }),
  },
  {
    name: 'fetch to the end of the 2022',
    priority: 10,
    runNewAfter: { day: 1 },
    argsFactory: () => ({
      scrapUntil: DateTime.fromObject({ year: 2022, month: 6, day: 28 }).toJSDate(),
    }),
  },
]

@Injectable()
export class DispositorService {
  private readonly logger = new Logger(DispositorService.name)
  private activeTasks: Map<string, string> = new Map()
  private taskLastRun: Map<string, DateTime> = new Map()

  constructor() {
    // Populate last runs
    for (const task of tasks) this.taskLastRun.set(task.name, DateTime.fromMillis(0))
  }

  private getRunIn(task: TaskDisposition) {
    if (this.taskLastRun.has(task.name))
      return this.taskLastRun.get(task.name).diffNow().negate().plus(task.runNewAfter)
  }

  private getNextTask(): [TaskDisposition, number | null] {
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

    this.logger.warn('All tasks are running! Running more prioritised task...')
    const defaultTask = tasks.sort((x, y) => y.priority - x.priority)[0]
    const runIn = this.getRunIn(defaultTask)
    return [defaultTask, runIn.as('milliseconds')]
  }

  public assignTask(client: Socket) {
    const [task, startIn] = this.getNextTask()
    this.activeTasks.set(client.id, task.name)
    const arg = task.argsFactory()

    if (startIn) {
      const d = Duration.fromMillis(startIn)
      this.logger.log(`Applyinng delay of ${d.toFormat('mm:ss')} to task "${task.name}"`)
    }

    setTimeout(
      () => client.emit(HypervisorEvents.COMMAND, HypervisorScrapperCommands.SCRAP, arg),
      startIn ?? 5000,
    )
  }

  public releaseTask(client: Socket) {
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
