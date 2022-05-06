import { useState } from 'react'
import { Button, Container, Grid, Input, Spacer, Text } from '@nextui-org/react'
import { ScheduleTimeline } from './ScheduleTimeline'
import { DateTime } from 'luxon'
import { useLocalStorage } from 'usehooks-ts'
import './ScheduleViewer.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faCogs,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { GroupPicker } from './GroupPicker'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Disclaimer } from './Disclaimer'
import { Settings } from './Settings'
import { TutorPicker } from './TutorPicker'
import { ChoicePicker, ModeChoice } from './ChoicePicker'
import { Link } from 'react-router-dom'

type DateNaviButtonProps = {
  icon: IconDefinition
}

function DateNaviButton({ icon }: DateNaviButtonProps) {
  return <Button bordered auto icon={<FontAwesomeIcon icon={icon} />} />
}

type DateNavigatorProps = {
  date: DateTime
  // setDate: React.Dispatch<React.SetStateAction<DateTime>>
}

export function DateNavigator({ date }: DateNavigatorProps) {
  const navi = useNavigate()

  return (
    <Grid.Container gap={1} justify={'center'}>
      <Grid>
        <Link to={'/app/?date=' + date.minus({ day: 1 }).toISODate()}>
          <DateNaviButton icon={faArrowLeft} />
        </Link>
      </Grid>
      <Grid>
        <Input
          bordered
          type={'date'}
          onChange={(e) => navi('/app/?date=' + e.target.value)}
          value={date.toISODate()}
        />
      </Grid>
      <Grid>
        <Link to={'/app/?date=' + date.plus({ day: 1 }).toISODate()}>
          <DateNaviButton icon={faArrowRight} />
        </Link>
      </Grid>
    </Grid.Container>
  )
}

export function ScheduleViewer() {
  // TODO: Why positioning of `useLocalStorage()` can impact avaliablitity of this function?
  const [choice, setChoice] = useLocalStorage<ModeChoice>('choice', ModeChoice.UNDEFINED)
  const [groups, setGroups] = useLocalStorage<string[]>('groups', [])
  const [tutors, setTutors] = useLocalStorage<string[]>('tutors', [])

  const [choicePickerVisible, setChoicePickerVisible] = useState(
    (groups ?? []).length === 0 &&
      (tutors ?? []).length === 0 &&
      choice === ModeChoice.UNDEFINED,
  )
  const [groupsPickerVisible, setGroupsPickerVisible] = useState(
    (groups ?? []).length === 0 && choice === ModeChoice.STUDENT,
  )
  const [tutorsPickerVisible, setTutorsPickerVisible] = useState(
    (tutors ?? []).length === 0 && choice === ModeChoice.TUTOR,
  )

  const [settingsVisible, setSettingsVisible] = useState(false)

  const [params] = useSearchParams()
  const dateRaw = params.get('date')

  const navi = useNavigate()

  const activeDate = dateRaw ? DateTime.fromISO(dateRaw) : DateTime.now()
  if (!dateRaw || !activeDate.isValid)
    navi({
      pathname: '/app/',
      search: createSearchParams({
        date: DateTime.now().toISODate(),
      }).toString(),
    })

  return (
    <Container xs>
      <Text h2>Plan zajęć</Text>
      <DateNavigator date={activeDate} />
      {activeDate.isValid && (
        <Text style={{ textAlign: 'center' }}>
          {activeDate.toLocaleString({ weekday: 'long' })},{' '}
          {activeDate.diff(DateTime.now().startOf('day')).shiftTo('days').toHuman()} od dziś
        </Text>
      )}
      <ScheduleTimeline
        date={activeDate}
        queryData={groups ?? tutors ?? []}
        choice={choice ?? ModeChoice.UNDEFINED}
      />
      <Spacer />
      <Button.Group bordered>
        <Button auto onClick={() => setChoicePickerVisible(true)}>
          Zmień grupy / prowadzącego
        </Button>
        <Button
          auto
          onClick={() => setSettingsVisible(true)}
          icon={<FontAwesomeIcon icon={faCogs} />}
        />
      </Button.Group>
      <Spacer />
      <GroupPicker
        groups={groups ?? []}
        setGroups={(groups) => setGroups(groups)}
        visible={groupsPickerVisible}
        setVisible={setGroupsPickerVisible}
      />
      <TutorPicker
        tutors={tutors ?? []}
        setTutors={(tutors) => setTutors(tutors)}
        visible={tutorsPickerVisible}
        setVisible={setTutorsPickerVisible}
      />
      <ChoicePicker
        choice={choice ?? ModeChoice.UNDEFINED}
        setChoice={(choice) => {
          setChoice(choice)
          setGroupsPickerVisible(choice === ModeChoice.STUDENT)
          setTutorsPickerVisible(choice === ModeChoice.TUTOR)
        }}
        visible={choicePickerVisible}
        setVisible={setChoicePickerVisible}
      />
      <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
      <Disclaimer />
    </Container>
  )
}
