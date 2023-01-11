import { Gain } from '../entities/gain'

export interface editGainDTO {
  ownerId: string
  gainId: string
  value?: number
  gainedAt?: Date
}

export interface IGainRepository {
  createGain(ownerId: string, gain: Gain): Promise<void>
  getGainById(ownerId: string, gainId: string): Promise<Gain | null>
  getAllGains(ownerId: string): Promise<Gain[]>
  editGain({
    ownerId,
    gainId,
    value,
    gainedAt
  }: editGainDTO): Promise<Gain | null>
  deleteGain(ownerId: string, gainId: string): Promise<void>
}
