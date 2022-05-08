import { faAdd, faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input, Modal, Text } from '@nextui-org/react'
import React, { useState } from 'react'
import { TutorDatalist } from '../datalists/TutorDatalist'

type TutorPickerProps = {
  tutors: string[]
  setTutors: (value: string[]) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

function shouldDisableButton(input: string, tutors: string[]) {
  if (!input) return true
  if (input.length === 0) return true
  if (tutors.includes(input)) return true
  return false
}

export function TutorPicker({
  tutors,
  setTutors,
  visible,
  setVisible,
}: TutorPickerProps) {
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const closeHandler = () => {
    setVisible(false)
  }

  const addTutor = () => {
    const input = document.querySelector('#addTutorInput') as HTMLInputElement
    if (!input) return
    if (tutors.includes(input.value) || input.value === '') return
    setTutors([...tutors, input.value].sort())
  }

  const rmTutor = (tutorName: string) => {
    setTutors(tutors.filter((g) => g !== tutorName))
  }

  return (
    <Modal
      closeButton={tutors.length > 0}
      blur
      preventClose
      open={visible}
      onClose={closeHandler}
    >
      <Modal.Header>
        <Text>Wyszukaj się w liście</Text>
      </Modal.Header>
      <Modal.Body>
        <TutorDatalist id={'allTutors'} />
        <Input
          id={'addTutorInput'}
          bordered
          label={'Nazwisko i imię'}
          placeholder={'Kowalski Adam'}
          list={'allTutors'}
          onChange={({ target }) =>
            setButtonDisabled(shouldDisableButton(target.value, tutors))
          }
          onFocus={({ target }) =>
            setButtonDisabled(shouldDisableButton(target.value, tutors))
          }
        />
        <Button
          // bordered
          auto
          id={'addTutorButton'}
          icon={<FontAwesomeIcon icon={faAdd} />}
          disabled={buttonDisabled}
          onClick={addTutor}
        >
          Dodaj
        </Button>
        {tutors.map((g, i) => {
          return (
            <p key={i}>
              <Button
                light
                auto
                style={{ display: 'inline-block' }}
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={() => rmTutor(g)}
              />
              <Text span>{g}</Text>
            </p>
          )
        })}
        <Button
          auto
          disabled={tutors.length === 0}
          icon={<FontAwesomeIcon icon={faCheck} />}
          color={tutors.length > 0 ? 'success' : undefined}
          onClick={() => setVisible(false)}
        >
          Gotowe
        </Button>
      </Modal.Body>
    </Modal>
  )
}
