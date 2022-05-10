import { useState } from 'react'
import styles from './ScheduleBlock.module.sass'
import { colors } from './colors.json'
import { Button, Modal, Text, Link } from '@nextui-org/react'
import { buildings } from '../calendar/buildings.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { AltapiScheduleEntry } from '../altapi'
import { ModeChoice } from './ChoicePicker'

type ScheduleBlockProps = {
  data: AltapiScheduleEntry
  operationMode: ModeChoice
}

export function ScheduleBlock({ data, operationMode }: ScheduleBlockProps) {
  const { begin, end } = data
  const timeBegin = begin.startOf('day').plus({ hours: 6 })
  const offset = begin.diff(timeBegin).as('hours')
  const heightByDuration = end.diff(begin).as('hours')

  const bgColorByType = colors.filter((c) => c.type === data.type)[0]?.color ?? '#0000FF'

  const [modalVisible, setModalVisible] = useState(false)
  const location = buildings.filter((b) => b.name === data.building)[0]

  // WARNING
  // Check ScheduleTimeline.module.sass for sizes
  return (
    <div
      id={encodeURIComponent(`${data.code}_in_${data.room}`)}
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
            <b>Rodzaj zajęć:</b> {data.type}
          </p>
          {operationMode === ModeChoice.STUDENT && (
            <p>
              <b>Prowadzący:</b> {data.tutors.join(', ')}
            </p>
          )}
          {operationMode === ModeChoice.TUTOR && (
            <p>
              <b>Grupy:</b> {data.groups.join(', ')}
            </p>
          )}
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
          {operationMode === ModeChoice.STUDENT && (
            <Link href={`https://www.google.com/maps/dir/?api=1&destination=${location.where}`}>
              <Button auto icon={<FontAwesomeIcon icon={faRoute} />}>
                Nawiguj
              </Button>
            </Link>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  )
}
