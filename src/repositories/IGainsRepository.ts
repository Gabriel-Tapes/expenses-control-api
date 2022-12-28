import { Gain } from '../entities/gain'

export interface IGainRepository {
  createGain(ownerId: string, gain: Gain): Promise<Gain>
  getGainById(gainId: string): Promise<{ gain: Gain, ownerId: string } | null>
  getAllGains(ownerId: string): Promise<Gain[]>
  editGain(editedGain: Gain): Promise<Gain | null>
  deleteGain(gainId: string): Promise<void>
}
