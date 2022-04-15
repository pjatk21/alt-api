import { faAdd, faBriefcase, faCheck, faSchool, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input, Modal, Text } from '@nextui-org/react'
import React, { useState } from 'react'

export enum ModeChoice {
  STUDENT,
  TUTOR,
  UNDEFINED,
}

type ChoicePickerParams = {
  choice: ModeChoice
  setChoice: (value: ModeChoice) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

export function ChoicePicker({ choice, setChoice, visible, setVisible }: ChoicePickerParams) {
  const [buttonDisabled, setButtonDisabled] = useState(true)

  const closeHandler = () => {
    setVisible(false)
  }
  return (
    <Modal closeButton={true} blur preventClose open={visible} onClose={closeHandler}>
      <Modal.Header>
        <Text>Wybierz tryb</Text>
      </Modal.Header>
      <Modal.Body>
        <Button auto id={'studentChoice'} onClick={() => { setChoice(ModeChoice.STUDENT); closeHandler() }} icon={<FontAwesomeIcon icon={faSchool} />}>Student</Button>
        <Button auto id={'tutorChoice'} onClick={() => { setChoice(ModeChoice.TUTOR); closeHandler() }} icon={<FontAwesomeIcon icon={faBriefcase} />}>Pracownik</Button>
      </Modal.Body>
    </Modal>
  )
}
