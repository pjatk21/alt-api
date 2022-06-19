import { useState } from 'react'
import { Button, Card, Container, Grid, Input, Spacer, Text } from '@nextui-org/react'
import { ScheduleTimeline } from './ScheduleTimeline'
import { DateTime } from 'luxon'
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'
import './ScheduleViewer.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faCogs,
  faToolbox,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { ExperimentalGroupPicker } from './pickers/GroupPicker'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Disclaimer } from './Disclaimer'
import { Settings, SettingsOptions } from './Settings'
import { ExperimentalTutorPicker } from './pickers/TutorPicker'
import { ChoicePicker, ModeChoice } from './pickers/ChoicePicker'

export type AltapiQueryOptions = Partial<{
  groups: string[]
  tutors: string[]
}>
import { Link } from 'react-router-dom'
import NavLikeBar from '../components/NavLikeBar'

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

function useNaviValidation(): DateTime {
  const [params] = useSearchParams()
  const dateRaw = params.get('date')

  const activeDate = dateRaw ? DateTime.fromISO(dateRaw) : DateTime.now()

  return activeDate
}

export function ScheduleViewer() {
  // TODO: Why positioning of `useLocalStorage()` can impact avaliablitity of this function?
  const [choice, setChoice] = useLocalStorage<ModeChoice>('choice', ModeChoice.UNDEFINED)
  const [{ groups, tutors }, setQueryOptions] = useLocalStorage<AltapiQueryOptions>(
    'queryOptions',
    {},
  )
  const settings = useReadLocalStorage<SettingsOptions>('settings')

  // migration stuff
  if (localStorage.getItem('groups')) {
    setQueryOptions({ groups: JSON.parse(localStorage.getItem('groups') as string) })
    localStorage.removeItem('groups')
  }

  // const { groups, tutors } = queryOptions

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

  const activeDate = useNaviValidation()

  return (
    <Container md>
      <NavLikeBar>
        <Text h2>Plan zajęć</Text>
      </NavLikeBar>
      <Card>
        <DateNavigator date={activeDate} />
      </Card>
      <Spacer />
      <Grid.Container justify="space-evenly">
        <Grid xs={12} sm={6} md={4}>
          <Container>
            <Text css={{ textAlign: 'center' }}>
              {activeDate.toLocaleString({ dateStyle: 'full' })}
            </Text>
            <ScheduleTimeline
              dontPrintSummary={!settings?.enableSummaries}
              date={activeDate}
              queryData={groups ?? tutors ?? []}
              choice={choice}
            />
          </Container>
        </Grid>
        <Grid xs={0} sm={6} md={4}>
          <Container>
            <Text css={{ textAlign: 'center' }}>
              {activeDate.plus({ day: 1 }).toLocaleString({ dateStyle: 'full' })}
            </Text>
            <ScheduleTimeline
              dontPrintSummary={!settings?.enableSummaries}
              date={activeDate.plus({ day: 1 })}
              queryData={groups ?? tutors ?? []}
              choice={choice}
            />
          </Container>
        </Grid>
        <Grid xs={0} md={4}>
          <Container>
            <Text css={{ textAlign: 'center' }}>
              {activeDate.plus({ day: 2 }).toLocaleString({ dateStyle: 'full' })}
            </Text>
            <ScheduleTimeline
              dontPrintSummary={!settings?.enableSummaries}
              date={activeDate.plus({ day: 2 })}
              queryData={groups ?? tutors ?? []}
              choice={choice}
            />
          </Container>
        </Grid>
      </Grid.Container>

      <Spacer />
      <Button.Group bordered>
        <Link to={'/app/toolbox'}>
          <Button auto icon={<FontAwesomeIcon icon={faToolbox} />} />
        </Link>
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
      <ExperimentalGroupPicker
        groups={groups ?? []}
        setGroups={(groups) => setQueryOptions({ groups })}
        visible={groupsPickerVisible}
        setVisible={setGroupsPickerVisible}
      />
      <ExperimentalTutorPicker
        tutors={tutors ?? []}
        setTutors={(tutors) => setQueryOptions({ tutors })}
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
