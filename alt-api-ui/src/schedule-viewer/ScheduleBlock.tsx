import { useState } from 'react'
import styles from './ScheduleBlock.module.sass'
import { colors } from './colors.json'
import { Button, Modal, Text, Link } from '@nextui-org/react'
import { buildings } from '../calendar/buildings.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { AltapiScheduleEntry } from '../altapi'
import { ModeChoice } from './pickers/ChoicePicker'

import type { SettingsOptions } from './Settings'
import { useReadLocalStorage } from 'usehooks-ts'

type ScheduleBlockProps = {
  data: AltapiScheduleEntry
  operationMode: ModeChoice
  displayRanges: {
    begin: number
    end: number
  }
}

const settings = useReadLocalStorage<SettingsOptions>('settings')

export function ScheduleBlock({ data, operationMode, displayRanges }: ScheduleBlockProps) {
  const { begin, end } = data
  const timeBegin = begin.startOf('day').plus({ hours: displayRanges.begin })
  const offset = begin.diff(timeBegin).as('hours')
  const heightByDuration = end.diff(begin).as('hours')

  // TODO: change bgColorByType to use specialisedColors if cyprianMode is enabled
  // Example: PPJ, GUI, SOP, etc. use same color (shade of violet, depending on if it's a lecture or a lab)
  // While math classes (like AM, MAD, ALG, etc.) use shades of yellow as in colors.json
  // So if cyprianMode is enabled, we should use specialisedColors instead of colors (from colors.json)
  // Color groups: Programming Classes, Math Classes, Databases Classes, etc.

  // TODO: add different icons for different types of classes (at the beginning of the classes names) if cyprianMode is enabled
  // Example: PPJ, GUI, SOP, etc. use same icon (computer)
  // While math classes (like AM, MAD, ALG, etc.) use different icons (notebook, pencil, or something similar)
  // So if cyprianMode is enabled, we should add icons for different types of classes
  // Icon groups: Programming Classes, Math Classes, Databases Classes, etc.

  // Icon groups nad color groups are the same, so we can use the same icon and color for all specified classes

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
