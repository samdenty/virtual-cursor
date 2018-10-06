import { Cursor } from '../Cursor'

export type Boundary = (coords: Cursor) => void

export * from './defaultBoundaries'
