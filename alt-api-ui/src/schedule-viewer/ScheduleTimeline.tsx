import React from 'react'
import { ScheduleBlock } from './ScheduleBlock'
import styles from './ScheduleTimeline.module.sass'

export function ScheduleTimeline() {
  return (
    <div className={styles.timelineContainer}>
      <div className={styles.content}>
        <ScheduleBlock />
        <ScheduleBlock />
      </div>
      <div className={styles.background}>
        {[...Array(24-6)].map((x, y) => (
          <div key={y} className={styles.line}>
            <span>{y+6}:00</span>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}
