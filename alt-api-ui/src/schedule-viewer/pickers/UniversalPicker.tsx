import { faAdd, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useFormik } from 'formik'
import { Modal, Input, Button, Text } from '@nextui-org/react'
import React from 'react'
import { ModeChoice } from './ChoicePicker'
import { useDatalist } from '../../datalists/datalistHook'
import { useEffectOnce } from 'usehooks-ts'

type UniversalPickerProps<T> = {
  values: T[]
  setValues: (value: T[]) => void
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
  datalist: T[]
  operationMode?: ModeChoice
}

export default function UniversalPicker(props: UniversalPickerProps<string>) {
  const formik = useFormik({
    initialValues: {
      valueSearch: '',
    },
    validate: (fields) => {
      const issues: Partial<Record<keyof typeof fields, string>> = {}

      if (props.values.includes(fields.valueSearch)) {
        issues.valueSearch = 'podana wartość jest juz dodana'
      }

      if (!props.datalist.includes(fields.valueSearch)) {
        issues.valueSearch = 'podana wartość nie istnieje'
      }

      return issues
    },
    onSubmit: (fields) => {
      console.log('submit', fields)
      props.values.push(fields.valueSearch)
      props.setValues(props.values)
    },
  })

  const rmValue = (target: any) => {
    props.setValues(props.values.filter((x) => x !== target))
  }

  useEffectOnce(() => {
    formik.validateForm()
  })

  const Datalist = useDatalist(props.datalist, 'valuesSource')

  return (
    <Modal
      closeButton={props.values.length > 0}
      blur
      preventClose
      open={props.visible}
      onClose={() => props.setVisible(false)}
    >
      <Modal.Header>
        <Text>Wyszukaj się w liście</Text>
      </Modal.Header>
      <Modal.Body>
        {Datalist}
        <Input
          name={'valueSearch'}
          id={'addTutorInput'}
          bordered
          label={
            props.operationMode == ModeChoice.STUDENT
              ? 'Grupa'
              : props.operationMode == ModeChoice.TUTOR
              ? 'Nazwisko i imię'
              : 'Oops...'
          }
          placeholder={
            props.operationMode == ModeChoice.STUDENT
              ? 'WIs I.2 - 1w'
              : props.operationMode == ModeChoice.TUTOR
              ? 'Tomaszewski Michał'
              : 'Oops once again...'
          }
          list={'valuesSource'}
          onChange={formik.handleChange}
          status={!formik.isValid ? 'error' : 'default'}
          helperText={!formik.isValid ? formik.errors.valueSearch : undefined}
        />
        <Button
          // bordered
          auto
          id={'addTutorButton'}
          icon={<FontAwesomeIcon icon={faAdd} />}
          disabled={!formik.isValid}
          onClick={() => formik.handleSubmit()}
        >
          Dodaj
        </Button>
        {props.values.map((g, i) => {
          return (
            <p key={i}>
              <Button
                light
                auto
                style={{ display: 'inline-block' }}
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={() => rmValue(g)}
              />
              <Text span>{g}</Text>
            </p>
          )
        })}
        <Button
          auto
          disabled={props.values.length === 0}
          icon={<FontAwesomeIcon icon={faCheck} />}
          //color={tutors.length > 0 ? 'success' : undefined}
          onClick={() => props.setVisible(false)}
        >
          Gotowe
        </Button>
      </Modal.Body>
    </Modal>
  )
}
