import { PieceType } from '@/types'
import { PieceShape } from './types'

// 标准俄罗斯方块形状定义
export const PIECE_SHAPES: Record<PieceType, PieceShape> = {
  [PieceType.I]: {
    type: PieceType.I,
    color: '#FFFFFF',
    rotations: [
      // 0度
      [
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false],
        [false, false, false, false]
      ],
      // 90度
      [
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false],
        [false, false, true, false]
      ],
      // 180度
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, true],
        [false, false, false, false]
      ],
      // 270度
      [
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [false, true, false, false]
      ]
    ]
  },
  
  [PieceType.O]: {
    type: PieceType.O,
    color: '#FFFFFF',
    rotations: [
      // 所有旋转状态相同
      [
        [false, false, false, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, false, false, false]
      ],
      [
        [false, false, false, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, false, false, false]
      ],
      [
        [false, false, false, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, false, false, false]
      ],
      [
        [false, false, false, false],
        [false, true, true, false],
        [false, true, true, false],
        [false, false, false, false]
      ]
    ]
  },
  
  [PieceType.T]: {
    type: PieceType.T,
    color: '#FFFFFF',
    rotations: [
      // 0度
      [
        [false, false, false, false],
        [false, true, false, false],
        [true, true, true, false],
        [false, false, false, false]
      ],
      // 90度
      [
        [false, false, false, false],
        [false, true, false, false],
        [false, true, true, false],
        [false, true, false, false]
      ],
      // 180度
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, false],
        [false, true, false, false]
      ],
      // 270度
      [
        [false, false, false, false],
        [false, true, false, false],
        [true, true, false, false],
        [false, true, false, false]
      ]
    ]
  },
  
  [PieceType.S]: {
    type: PieceType.S,
    color: '#FFFFFF',
    rotations: [
      // 0度
      [
        [false, false, false, false],
        [false, true, true, false],
        [true, true, false, false],
        [false, false, false, false]
      ],
      // 90度
      [
        [false, false, false, false],
        [false, true, false, false],
        [false, true, true, false],
        [false, false, true, false]
      ],
      // 180度
      [
        [false, false, false, false],
        [false, false, false, false],
        [false, true, true, false],
        [true, true, false, false]
      ],
      // 270度
      [
        [false, false, false, false],
        [true, false, false, false],
        [true, true, false, false],
        [false, true, false, false]
      ]
    ]
  },
  
  [PieceType.Z]: {
    type: PieceType.Z,
    color: '#FFFFFF',
    rotations: [
      // 0度
      [
        [false, false, false, false],
        [true, true, false, false],
        [false, true, true, false],
        [false, false, false, false]
      ],
      // 90度
      [
        [false, false, false, false],
        [false, false, true, false],
        [false, true, true, false],
        [false, true, false, false]
      ],
      // 180度
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, false, false],
        [false, true, true, false]
      ],
      // 270度
      [
        [false, false, false, false],
        [false, true, false, false],
        [true, true, false, false],
        [true, false, false, false]
      ]
    ]
  },
  
  [PieceType.J]: {
    type: PieceType.J,
    color: '#FFFFFF',
    rotations: [
      // 0度
      [
        [false, false, false, false],
        [true, false, false, false],
        [true, true, true, false],
        [false, false, false, false]
      ],
      // 90度
      [
        [false, false, false, false],
        [false, true, true, false],
        [false, true, false, false],
        [false, true, false, false]
      ],
      // 180度
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, false],
        [false, false, true, false]
      ],
      // 270度
      [
        [false, false, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [true, true, false, false]
      ]
    ]
  },
  
  [PieceType.L]: {
    type: PieceType.L,
    color: '#FFFFFF',
    rotations: [
      // 0度
      [
        [false, false, false, false],
        [false, false, true, false],
        [true, true, true, false],
        [false, false, false, false]
      ],
      // 90度
      [
        [false, false, false, false],
        [false, true, false, false],
        [false, true, false, false],
        [false, true, true, false]
      ],
      // 180度
      [
        [false, false, false, false],
        [false, false, false, false],
        [true, true, true, false],
        [true, false, false, false]
      ],
      // 270度
      [
        [false, false, false, false],
        [true, true, false, false],
        [false, true, false, false],
        [false, true, false, false]
      ]
    ]
  }
}