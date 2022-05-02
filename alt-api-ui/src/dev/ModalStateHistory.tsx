import { Loading, Modal, Table, Text } from '@nextui-org/react'
import ky from 'ky'
import { DateTime } from 'luxon'
import React from 'react'
import { useQuery } from 'react-query'
import type { ScrapperLike } from '../scrappers/Scrappers'
import { baseUrl } from '../util'

type ModalStateHistoryProps = {
  scrapper: ScrapperLike
  visible: boolean
  setVisible: (value: React.SetStateAction<boolean>) => void
}

function colorFromState(state: string) {
  switch (state) {
    case 'awaiting':
      return 'success'
    case 'work':
      return 'primary'
    case 'ready':
      return 'secondary'
    default:
      return 'warning'
  }
}

const getStateHistory = (uuid: string) =>
  ky.get(`${baseUrl}hypervisor/history/${uuid}`).json() as Promise<
    { newState: string; createdAt: string }[]
  >

export function ModalStateHistory({ scrapper, visible, setVisible }: ModalStateHistoryProps) {
  const { isLoading, data, error } = useQuery(['history', scrapper.uuid], () =>
    getStateHistory(scrapper.uuid),
  )

  if (!data || isLoading) return <Loading />

  return (
    <Modal closeButton blur open={visible} onClose={() => setVisible(false)}>
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <Table>
          <Table.Header>
            <Table.Column>Kiedy</Table.Column>
            <Table.Column>Nowy status</Table.Column>
          </Table.Header>
          <Table.Body>
            {data.map((r, i) => (
              <Table.Row key={i}>
                <Table.Cell>
                  {DateTime.fromISO(r.createdAt).toLocaleString({
                    dateStyle: 'medium',
                    timeStyle: 'medium',
                  })}
                </Table.Cell>
                <Table.Cell>
                  <Text color={colorFromState(r.newState)}>{r.newState}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  )
}
