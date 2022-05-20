import { faBriefcase, faSchool } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal, Text } from '@nextui-org/react'
import React from 'react'

import type { SettingsOptions } from './Settings'
import { useReadLocalStorage } from 'usehooks-ts'

export enum ModeChoice {
  STUDENT,
  TUTOR,
  UNDEFINED,
}

const settings = useReadLocalStorage<SettingsOptions>('settings')

type ChoicePickerParams = {
  choice: ModeChoice
  setChoice: (value: ModeChoice) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

export function ChoicePicker({ choice, setChoice, visible, setVisible }: ChoicePickerParams) {
  const closeHandler = () => {
    setVisible(false)
  }
  if(settings?.cyprianMode) {
    return (
      <Modal
        closeButton={choice !== undefined && choice !== ModeChoice.UNDEFINED}
        blur
        preventClose
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text>Kim jesteś, wojowniku?</Text>
        </Modal.Header>
        <Modal.Body>
          <Button
            auto
            id={'studentChoice'}
            onClick={() => {
              setChoice(ModeChoice.STUDENT)
              closeHandler()
            }}
            icon={<FontAwesomeIcon icon={faSchool} />}
          >
            ☠️ Studentem
          </Button>
          <Button
            auto
            id={'tutorChoice'}
            onClick={() => {
              setChoice(ModeChoice.TUTOR)
              closeHandler()
            }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            🧑‍✈️ Wodzem
          </Button>
        </Modal.Body>
      </Modal>
    )
  }
  else {
    return (
      <Modal
        closeButton={choice !== undefined && choice !== ModeChoice.UNDEFINED}
        blur
        preventClose
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text>Wybierz tryb</Text>
        </Modal.Header>
        <Modal.Body>
          <Button
            auto
            id={'studentChoice'}
            onClick={() => {
              setChoice(ModeChoice.STUDENT)
              closeHandler()
            }}
            icon={<FontAwesomeIcon icon={faSchool} />}
          >
            Student
          </Button>
          <Button
            auto
            id={'tutorChoice'}
            onClick={() => {
              setChoice(ModeChoice.TUTOR)
              closeHandler()
            }}
            icon={<FontAwesomeIcon icon={faBriefcase} />}
          >
            Pracownik
          </Button>
        </Modal.Body>
      </Modal>
    )
  }
  
}
