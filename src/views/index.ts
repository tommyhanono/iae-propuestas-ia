import type { ComponentType } from 'react'
import { Lobby } from './lobby'
import { BC1, BC2, BC3, BC4, BC5, BC6, BC7, BC8 } from './builders'
import { CU1, CU2, CU3, CU4, CU5 } from './curriculo'

/** Una vista por nodo, en el mismo orden que NODES. */
export const NODE_VIEWS: ComponentType[] = [Lobby, BC1, BC2, BC3, BC4, BC5, BC6, BC7, BC8, CU1, CU2, CU3, CU4, CU5]
