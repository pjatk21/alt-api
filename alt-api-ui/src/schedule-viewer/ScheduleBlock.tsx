import { DateTime } from 'luxon'
import React, { useState } from 'react'
import { ScheduleEntryRawResponse } from '../types'
import styles from './ScheduleBlock.module.sass'
import { colors } from './colors.json'
import { Button, Modal, Text, Link } from '@nextui-org/react'
import { buildings } from '../calendar/buildings.json'

type ScheduleBlockProps = {
  data: ScheduleEntryRawResponse
}

export function ScheduleBlock({ data }: ScheduleBlockProps) {
  const begin = DateTime.fromISO(data.begin)
  const end = DateTime.fromISO(data.end)
  const timeBegin = begin.startOf('day').plus({ hours: 6 })
  const offset = begin.diff(timeBegin).as('hours')
  const heightByDuration = end.diff(begin).as('hours')
  console.log({ code: data.code, offset, heightByDuration })

  const bgColorByType = colors.filter((c) => c.type === data.type)[0]?.color ?? '#0000FF'

  const [modalVisible, setModalVisible] = useState(false)
  const location = buildings.filter((b) => b.name === data.building)[0]

  // WARNING
  // 50 -> 1hr in timeline (elem height + margin (34 + 16))
  // 1 + 10 -> hr size + top padding size
  return (
    <div
      className={styles.timelineBlock}
      style={{
        top: offset * 55 + 10 + 1,
        height: heightByDuration * 55,
        backgroundColor: bgColorByType,
      }}
      onClick={() => setModalVisible(true)}
    >
      <div className={styles.row}>
        <span className={styles.code}>{data.code}</span>
        <span className={styles.room}>{data.room}</span>
      </div>
      <span className={styles.time}>
        od {begin.toLocaleString({ timeStyle: 'short' })} do{' '}
        {end.toLocaleString({ timeStyle: 'short' })}
      </span>
      <Modal
        preventClose
        closeButton
        open={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <Modal.Header>
          <Text b>{data.name}</Text>
        </Modal.Header>
        <Modal.Body>
          <p>
            <b>Prowadzący:</b> {data.tutor}
          </p>
          <p>
            <b>Czas trwania:</b> {end.diff(begin).shiftTo('hours', 'minutes').toHuman()}
          </p>
          <p>
            <b>Sala:</b> {data.room}
          </p>
          <p>
            <b>Budynek {location.name}:</b>{' '}
            {buildings.filter((b) => b.name === data.building)[0].where}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Link
            href={`https://www.google.com/maps/dir/?api=1&destination=${location.where}`}
          >
            <Button>Nawiguj</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
