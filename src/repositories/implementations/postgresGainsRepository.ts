import { Pool } from 'pg'
import { createDatabaseConnection } from '@database/connectDatabase'
import { Gain } from '@entities/gain'
import { IGainRepository } from '@repositories/IGainsRepository'

export const PostgresGainsRepository = (): IGainRepository => {
  let client: Pool

  const connectDatabase = async () => {
    if (!client) client = await createDatabaseConnection()
  }

  const createGain = async (ownerId: string, gain: Gain): Promise<Gain> => {
    await connectDatabase()

    await client.query(
      'INSERT INTO GAINS (ID, VALUE, GAINED_AT, OWNER_ID) VALUES ($1, $2, $3, $4)',
      [gain.id, gain.value, gain.gainedAt, ownerId]
    )

    return gain
  }

  const getGainById = async (
    gainId: string
  ): Promise<{ gain: Gain; ownerId: string } | null> => {
    await connectDatabase()

    const { rows } = await client.query('SELECT * FROM GAINS WHERE ID = $1', [
      gainId
    ])

    if (!rows.length) return null

    const { value, gained_at: gainedAt } = rows[0]

    const { owner_id: ownerId }: { owner_id: string } = rows[0]

    const gain = new Gain(
      {
        value,
        gainedAt
      },
      gainId
    )

    return {
      gain,
      ownerId
    }
  }

  const getAllGains = async (ownerId: string): Promise<Gain[]> => {
    await connectDatabase()

    const { rows } = await client.query(
      'SELECT * FROM GAINS WHERE OWNER_ID = $1',
      [ownerId]
    )

    if (!rows.length) return []

    const allUserGains = rows.map(gain => {
      return new Gain(
        {
          value: gain.value,
          gainedAt: gain.gained_at
        },
        gain.id
      )
    })

    return allUserGains
  }

  const editGain = async (editedGain: Gain): Promise<Gain> => {
    await connectDatabase()

    const oldGain = await getGainById(editedGain.id)

    if (!oldGain) return null

    await client.query(
      'UPDATE GAINS SET (VALUE, GAINED_AT) VALUES ($2, $3) WHERE ID = $1',
      [editedGain.id, editedGain.value, editedGain.gainedAt]
    )

    return editedGain
  }

  const deleteGain = async (gainId: string): Promise<void> => {
    await connectDatabase()

    await client.query('DELETE FROM GAINS WHERE ID = $1', [gainId])
  }

  return Object.freeze({
    createGain,
    getGainById,
    getAllGains,
    editGain,
    deleteGain
  })
}
